/**
 * Executes the compiled Send Task Reminder operation against a stubbed
 * apiRequest, and asserts the emitted calls match the captured Keephub UI
 * traffic exactly (method, URL, query string, body).
 *
 * Run after `npm run build`:  node scripts/verify-reminder.js
 */
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist', 'nodes', 'Keephub');

// Patch apiRequest on the shared helpers module before the action requires it.
const helpers = require(path.join(DIST, 'utils', 'helpers.js'));
const calls = [];
let getResponse = {
  _id: '6a52b865dffcb403abf64f82',
  status: 'partial',
  lastTaskUserCount: 3,
  lastReminderAt: '2026-08-14T17:24:27.328Z',
  canEdit: true,
};
helpers.apiRequest = async function (method, endpoint, body) {
  calls.push({ method, endpoint, body });
  if (method === 'PUT') {
    return { _id: '6a52b865dffcb403abf64f82', status: 'partial', lastTaskUserCount: 3 };
  }
  if (getResponse instanceof Error) throw getResponse;
  return getResponse;
};

const sendReminder = require(path.join(DIST, 'actions', 'task', 'sendReminder.js'));
const taskDesc = require(path.join(DIST, 'descriptions', 'TaskDescription.js'));
const taskIndex = require(path.join(DIST, 'actions', 'task', 'index.js'));

let failures = 0;
const expect = (label, cond, extra) => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}`);
  if (!cond) { failures++; if (extra !== undefined) console.log('      got:', JSON.stringify(extra)); }
};

// ---- registration -------------------------------------------------------
const opField = taskDesc.taskFields.find((f) => f.name === 'operation');
const opValues = opField.options.map((o) => o.value);
expect('operation is registered in the UI list', opValues.includes('sendTaskReminder'));

const opEntry = opField.options.find((o) => o.value === 'sendTaskReminder');
expect('operation has name/description/action (integrations-page visibility)',
  Boolean(opEntry.name && opEntry.description && opEntry.action));

const sorted = [...opField.options.map((o) => o.name)].sort((a, b) => a.localeCompare(b));
expect('operation list is still alphabetical',
  JSON.stringify(opField.options.map((o) => o.name)) === JSON.stringify(sorted));

const taskIdField = taskDesc.taskFields.find((f) => f.name === 'taskId' && f.displayOptions.show.operation.includes('getTask'));
expect('Task ID field is shown for the new operation',
  taskIdField.displayOptions.show.operation.includes('sendTaskReminder'));

expect('execute is exported from the task action index',
  typeof taskIndex.sendTaskReminderExecute === 'function');

// ---- execution ----------------------------------------------------------
const ctx = (params) => ({
  getNodeParameter: (name, _i, fallback) => (name in params ? params[name] : fallback),
  getNode: () => ({ name: 'Send Task Reminder' }),
});

(async () => {
  // default: verify on
  calls.length = 0;
  let out = await sendReminder.execute.call(
    ctx({ taskId: '6a52b865dffcb403abf64f82', options: {} }), {}, 0,
  );
  let r = out[0].json;

  console.log('\ncalls emitted:');
  for (const c of calls) console.log(`  ${c.method} ${c.endpoint}  body=${JSON.stringify(c.body)}`);
  console.log('result:', JSON.stringify(r), '\n');

  const put = calls[0];
  expect('method is PUT', put.method === 'PUT', put.method);
  expect('URL matches the captured call exactly',
    put.endpoint === '/tasktemplates/6a52b865dffcb403abf64f82?_id=6a52b865dffcb403abf64f82&action=reminder',
    put.endpoint);
  expect('body matches the captured payload exactly',
    JSON.stringify(put.body) === JSON.stringify({ _id: '6a52b865dffcb403abf64f82', action: 'reminder' }),
    put.body);
  expect('verification reads the management view',
    calls[1] && calls[1].method === 'GET' &&
    calls[1].endpoint === '/tasktemplates/6a52b865dffcb403abf64f82?management=true',
    calls[1]);
  expect('lastReminderAt is returned', r.lastReminderAt === '2026-08-14T17:24:27.328Z', r.lastReminderAt);
  expect('verified is true when the timestamp is present', r.verified === true);

  // verify off -> single call
  calls.length = 0;
  out = await sendReminder.execute.call(
    ctx({ taskId: 'abc123', options: { verify: false } }), {}, 0,
  );
  expect('verify:false makes exactly one API call', calls.length === 1, calls.length);
  expect('verify:false still reports the reminder was sent', out[0].json.reminderSent === true);

  // read-back fails -> reminder still reported, verified false
  calls.length = 0;
  getResponse = new Error('403 forbidden');
  out = await sendReminder.execute.call(
    ctx({ taskId: 'abc123', options: {} }), {}, 0,
  );
  r = out[0].json;
  expect('a failed read-back does not fail the operation', r.reminderSent === true);
  expect('a failed read-back reports verified:false', r.verified === false);
  expect('a failed read-back surfaces the reason', typeof r.verifyError === 'string', r.verifyError);
  getResponse = { _id: 'x' };

  // no lastReminderAt in the read-back -> verified false, not a false success
  calls.length = 0;
  out = await sendReminder.execute.call(ctx({ taskId: 'abc123', options: {} }), {}, 0);
  expect('missing lastReminderAt is reported as unverified', out[0].json.verified === false);

  // empty id
  let threw = false;
  try {
    await sendReminder.execute.call(ctx({ taskId: '   ', options: {} }), {}, 0);
  } catch (e) { threw = true; }
  expect('empty task id is rejected', threw);

  console.log(failures ? `\n${failures} FAILURE(S)` : '\nAll checks passed');
  process.exit(failures ? 1 : 0);
})();

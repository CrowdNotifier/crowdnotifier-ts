import {Log} from '../log';
import {waitReady} from '..';
import {
  testCrowdNotifierPrimitivesOrganization,
} from './crowd_notifier_primitives.spec';

const log = new Log('v2_1/main.spec');
log.info(`Starting at: ${new Date()}`);

export async function main() {
  await waitReady();
  testCrowdNotifierPrimitivesOrganization();
  log.info('All tests completed successfully');
}

main().catch((e) => {
  log.panic(e);
});

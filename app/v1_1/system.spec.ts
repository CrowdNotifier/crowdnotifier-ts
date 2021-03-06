import {Log, sodium} from '@c4dt/libcrowdnotifier';
import {HealthAuthority, Location, Visit} from './system';

const log = new Log('v1_1/system.spec');
log.info(`Starting at: ${new Date()}`);

async function main() {
  await sodium.ready;

  log.info('Setting up backends');
  const urlEntry = 'app:entry';
  const urlTrace = 'app:trace';
  const healthAuthority = new HealthAuthority();
  const location1 = new Location(healthAuthority.keyPair.publicKey,
      'FooBar', 'Lausanne', 'any', 1);
  const location1qrTrace = location1.getQRtrace(urlTrace);
  const location2 = new Location(healthAuthority.keyPair.publicKey,
      'BarMitzva', 'Lausanne', 'unknown', 2);
  // const location2qrTrace = location2.getQRtrace(urlTrace);

  log.info('Creating two visits');
  const counter1 = 1000;
  const visit1 = new Visit(location1.getQRentry(urlEntry), counter1, counter1);

  const counter2 = 1001;
  const visit2 = new Visit(location2.getQRentry(urlEntry), counter2, counter2);

  log.info('Location 1 got infected during three hours - creating traces');
  const info1 = location1.info;
  const trace1_1 = healthAuthority
      .createTrace(location1qrTrace, info1, counter1 - 1, counter1 - 1);
  const trace1_2 = healthAuthority
      .createTrace(location1qrTrace, info1, counter1, counter1);
  const trace1_3 = healthAuthority
      .createTrace(location1qrTrace, info1, counter1 + 1, counter1 + 1);
  if (trace1_1 === undefined ||
      trace1_2 === undefined ||
      trace1_3 === undefined) {
    throw new Error('Couldn\'t create the traces');
  }

  log.info('Checking if visit1 gets correctly notified');
  log.assert(visit1.verifyExposure([trace1_1]), undefined,
      'Shouldn\'t match counter-1');
  log.assert(visit1.verifyExposure([trace1_2]), [counter1, counter1],
      'Should match counter');
  log.assert(visit1.verifyExposure([trace1_3]), undefined,
      'Shouldn\'t match counter-1');

  log.info('Checking if visit2 gets correctly NOT notified');
  log.assert(visit2.verifyExposure([trace1_1]), undefined,
      'trace1_1 shouldn\'t match visit2');
  log.assert(visit2.verifyExposure([trace1_2]), undefined,
      'trace1_2 shouldn\'t match visit2');
  log.assert(visit2.verifyExposure([trace1_3]), undefined,
      'trace1_3 shouldn\'t match visit2');

  log.info('System check successfully finished!');
}

main().catch((e) => {
  log.panic(e);
});

import { GtfsModule } from './gtfs.module';

describe('GtfsModule', () => {
  let gtfsModule: GtfsModule;

  beforeEach(() => {
    gtfsModule = new GtfsModule();
  });

  it('should create an instance', () => {
    expect(gtfsModule).toBeTruthy();
  });
});

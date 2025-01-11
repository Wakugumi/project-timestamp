enum EnumDeviceStatus {
  initialized = 0,
  starting = 0,
  running = 0,
  stopping = 0,
  stopped = 0,
  fault = 0
}

/**
  * defines commons stats, if backend supports, return these properties
  * otherwise return zeros instread
  */
class BackendStats {
  backend_name: string = "None";
  fps: number = 0;
  exposure_time_ms: number = 0;
  lens_position: number = 0;
  again: number = 0;
  dgain: number = 0;
  lux: number = 0;
  colour_temperature: number = 0;
  sharpness: number = 0;
}


class AbstractBackend {

}

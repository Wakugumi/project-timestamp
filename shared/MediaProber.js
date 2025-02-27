class MediaProber {
  constructor(probeSize = 1024 * 1024) {
    // Default 1MB probe size
    this.probeSize = probeSize;
    this.buffer = Buffer.alloc(0);
    this.isProbeComplete = false;
    this.onProbeComplete = null;
  }

  addChunk(chunk) {
    // Add new chunk to our accumulated buffer
    this.buffer = Buffer.concat([this.buffer, chunk]);

    // Check if we've reached our probe size
    if (!this.isProbeComplete && this.buffer.length >= this.probeSize) {
      this.isProbeComplete = true;

      // Call callback if registered
      if (this.onProbeComplete) {
        this.onProbeComplete(this.buffer);
      }
    }

    return this.isProbeComplete;
  }

  // Get the current buffer (might be partial or complete probe)
  getBuffer() {
    return this.buffer;
  }
}

"use strict";function e(e,t,s,i){return new(s||(s=Promise))((function(r,o){function n(e){try{c(i.next(e))}catch(e){o(e)}}function a(e){try{c(i.throw(e))}catch(e){o(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof s?t:new s((function(e){e(t)}))).then(n,a)}c((i=i.apply(e,t||[])).next())}))}"function"==typeof SuppressedError&&SuppressedError;class t{constructor(){this.listeners={}}on(e,t){return this.listeners[e]||(this.listeners[e]=new Set),this.listeners[e].add(t),()=>this.un(e,t)}once(e,t){const s=this.on(e,t),i=this.on(e,(()=>{s(),i()}));return s}un(e,t){this.listeners[e]&&(t?this.listeners[e].delete(t):delete this.listeners[e])}unAll(){this.listeners={}}emit(e,...t){this.listeners[e]&&this.listeners[e].forEach((e=>e(...t)))}}class s extends t{constructor(e){super(),this.subscriptions=[],this.options=e}onInit(){}init(e){this.wavesurfer=e,this.onInit()}destroy(){this.emit("destroy"),this.subscriptions.forEach((e=>e()))}}const i=["audio/webm","audio/wav","audio/mpeg","audio/mp4","audio/mp3"];class r extends s{constructor(){super(...arguments),this.stream=null,this.mediaRecorder=null}static create(e){return new r(e||{})}renderMicStream(e){const t=new AudioContext,s=t.createMediaStreamSource(e),i=t.createAnalyser();s.connect(i);const r=i.frequencyBinCount,o=new Float32Array(r),n=r/t.sampleRate;let a;const c=()=>{i.getFloatTimeDomainData(o),this.wavesurfer&&(this.wavesurfer.options.cursorWidth=0,this.wavesurfer.options.interact=!1,this.wavesurfer.load("",[o],n)),a=requestAnimationFrame(c)};return c(),()=>{cancelAnimationFrame(a),null==s||s.disconnect(),null==t||t.close()}}startMic(){return e(this,void 0,void 0,(function*(){let e;try{e=yield navigator.mediaDevices.getUserMedia({audio:!0})}catch(e){throw new Error("Error accessing the microphone: "+e.message)}const t=this.renderMicStream(e);return this.subscriptions.push(this.once("destroy",t)),this.stream=e,e}))}stopMic(){this.stream&&(this.stream.getTracks().forEach((e=>e.stop())),this.stream=null)}startRecording(){return e(this,void 0,void 0,(function*(){const e=this.stream||(yield this.startMic()),t=this.mediaRecorder||new MediaRecorder(e,{mimeType:this.options.mimeType||i.find((e=>MediaRecorder.isTypeSupported(e))),audioBitsPerSecond:this.options.audioBitsPerSecond});this.mediaRecorder=t,this.stopRecording();const s=[];t.ondataavailable=e=>{e.data.size>0&&s.push(e.data)},t.onstop=()=>{var e;const i=new Blob(s,{type:t.mimeType});this.emit("record-end",i),!1!==this.options.renderRecordedAudio&&(null===(e=this.wavesurfer)||void 0===e||e.load(URL.createObjectURL(i)))},t.start(),this.emit("record-start")}))}isRecording(){var e;return"recording"===(null===(e=this.mediaRecorder)||void 0===e?void 0:e.state)}stopRecording(){var e;this.isRecording()&&(null===(e=this.mediaRecorder)||void 0===e||e.stop())}destroy(){super.destroy(),this.stopRecording(),this.stopMic()}}module.exports=r;
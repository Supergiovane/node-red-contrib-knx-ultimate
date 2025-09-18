;(function (root) {
  const KNXSendSnippets = [
    {
      id: 'status-ga-check',
      title: 'Status GA check',
      code: `// @ts-nocheck
// Replace 'x/x/x' with the real status group address.
const statusGA = getGAValue('x/x/x','1.001');
if (msg.payload !== statusGA){ // " !==" means " not equal"
    return msg;
 }else{
// Both values are identical, so i don't send the msg.
    node.status({fill:"grey",shape:"dot",text:"Not sent"}); 
    return; 
}`
    },
    {
      id: 'toggle-value',
      title: 'Toggle value',
      code: `// @ts-nocheck
// After 5000 milliseconds, toggle.
setTimeout(function() {
    toggle();
}, 5000);
return msg;`
    },
    {
      id: 'send-false-delay',
      title: 'Send false after 5 secs',
      code: `// @ts-nocheck
// After 5000 milliseconds, send false.
setTimeout(function () {
    self(false);
}, 5000);
return msg;`
    },
    {
      id: 'send-20-percent-other-ga',
      title: 'Send 20% to another GA',
      code: `// @ts-nocheck
// Send 20% to the GA 1/0/1 having DPT 5.001
if (msg.payload === true){
    setGAValue('1/0/1',20,'5.001') 
}
return msg;`
    }
  ];

  if (root) {
    root.KNXSendSnippets = KNXSendSnippets;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = KNXSendSnippets;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));

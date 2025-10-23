;(function (root) {
  const KNXSendSnippets = [
    {
      id: 'status-ga-check',
      title: 'Status GA check',
      code: `// @ts-nocheck
// Replace '' with the real status group address.
const statusGA = getGAValue('','1.001');
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
    },
    {
      id: 'motion-activated-light',
      title: 'Turn on light on motion, auto off',
      code: `// @ts-nocheck
// This snippet expects a motion sensor boolean on msg.payload.
// When motion is detected turn the light on, otherwise schedule an auto-off.
if (msg.payload === true) {
    // Turn on the light immediately.
    setGAValue('', true, '1.001'); // Replace '' with your light GA.
    // Cancel pending auto-off timers if any.
    context.set('autoOffTimer', null);
} else {
    // Schedule auto-off after 90 seconds of no motion.
    const timer = setTimeout(() => {
        setGAValue('', false, '1.001'); // Replace '' with your light GA.
    }, 90000);
    context.set('autoOffTimer', timer);
}
return;`
    },
    {
      id: 'window-hvac-standby',
      title: 'HVAC standby when window open',
      code: `// @ts-nocheck
// msg.payload should contain the window contact state (true = open).
// If the window is open, set the HVAC to standby, otherwise restore comfort.
const hvacGa = ''; // Replace with your HVAC GA.
const standbyValue = 'standby';
const comfortValue = 'comfort';

if (msg.payload === true) {
    setGAValue(hvacGa, standbyValue, '20.102'); // HVAC mode DPT.
    node.status({fill: 'yellow', shape: 'dot', text: 'HVAC standby'});
} else {
    setGAValue(hvacGa, comfortValue, '20.102');
    node.status({fill: 'green', shape: 'dot', text: 'HVAC comfort'});
}
return;`
    },
    {
      id: 'night-door-alert',
      title: 'Night door alert',
      code: `// @ts-nocheck
// Send a KNX notification GA if a door opens between 22:00 and 06:00.
const now = new Date();
const hour = now.getHours();

if (msg.payload === true && (hour >= 22 || hour < 6)) {
    setGAValue('', true, '1.001'); // Replace '' with your alert GA.
    node.status({fill: 'red', shape: 'ring', text: 'Door alert sent'});
}
return;`
    },
    {
      id: 'bedtime-all-off',
      title: 'Bedtime all off',
      code: `// @ts-nocheck
// Turn off a list of lights when a bedtime command is received.
const lights = [
    '', // Replace with GA of the first light
    ''  // Replace with GA of the second light
];

if (msg.payload === 'bedtime') {
    lights.forEach(ga => {
        if (ga) {
            setGAValue(ga, false, '1.001');
        }
    });
    node.status({fill: 'blue', shape: 'dot', text: 'All lights off'});
    return;
}
return msg;`
    }
  ]

  if (root) {
    root.KNXSendSnippets = KNXSendSnippets
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = KNXSendSnippets
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this))

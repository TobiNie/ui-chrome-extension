

var leftFader = 0;
var string = "";
var faderString = "";
var auxString = "";
var mixString = "";

var allOutputs;


navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);

function onMIDISuccess(midiAccess) {
    for (var input of midiAccess.inputs.values()) {
        input.onmidimessage = getMIDIMessage;
    }
    allOutputs = midiAccess.outputs;


}

function sendMIDIMessage(sendMessage) {

    console.log(sendMessage);
    // allOutputs.forEach(function(port){
    //     console.log('id:', port.id, 'manufacturer:', port.manufacturer, 'name:', port.name, 'version:', port.version);

    //   });
    // allOutputs.forEach(function(port){
    //     port.open();
    //     port.send(sendMessage);
    //   });
    var output = allOutputs.get("output-3");
    output.open();
    output.send(sendMessage);
}



function getMIDIMessage(message) {
    var midiData = message.data;
    var data = 0;

    console.log("[" + message.data[0] + "] [" + message.data[1] + "] [" + message.data[2] + "]");

    updateStrings();

    var statusByte = (midiData[0] & 0xF0);
    var channel = (midiData[0] & 0x0F);
    switch (statusByte) {

        case 0xE0:   //pitchbend = faders
            if (channel < 8) {
                string = faderString + ((midiData[0] & 0x0F) + leftFader) + "." + auxString + mixString;
            }
            else if (channel = 9) {
                string = "m.mix";
            }
            data = (midiData[1] + (midiData[2] * 128)) / 16383;
            console.log(string + " " + data);
            origSetValue(string, data);
            updateByKey(string);
            break;

        case 0x90:  //note on
            if (midiData[2] > 0 && channel == 0) //only handle button press
            {
                switch (midiData[1])  //note
                {
                    case 8: //solo
                    case 9:
                    case 10:
                    case 11:
                    case 12:
                    case 13:
                    case 14:
                    case 15:
                        string = "i." + ((midiData[1] - 8) + leftFader) + "." + auxString + "solo";
                        data = !getValue(string);
                        console.log(string + " " + data);
                        setValue(string, data);
                        updateByKey(string);
                        break;
                    case 16: //mute
                    case 17:
                    case 18:
                    case 19:
                    case 20:
                    case 21:
                    case 22:
                    case 23:
                        string = "i." + ((midiData[1] - 16) + leftFader) + "." + auxString + "mute";
                        data = !getValue(string);
                        console.log(string + " " + data);
                        setValue(string, data);
                        updateByKey(string);
                        break;
                    case 24: //select
                    case 25:
                    case 26:
                    case 27:
                    case 28:
                    case 29:
                    case 30:
                    case 31:
                        setSelected(midiData[1] - 24 + leftFader);
                        break;
                    case 32: //vpot switches
                    case 33:
                    case 34:
                    case 35:
                    case 36:
                    case 37:
                    case 38:
                    case 39:
                        break;

                    case 40: //track
                        if (mode == E_MODE.EDIT && editWidget.mode == editWidget.E_MODE.eqch) {
                            setMode(E_MODE.MIX);
                        }
                        else {
                            setMode(E_MODE.EDIT);
                            editWidget.setMode(editWidget.E_MODE.eqch);
                        }
                        break;
                    case 41: //send
                        if (mode == E_MODE.EDIT && editWidget.mode == editWidget.E_MODE.gate) {
                            setMode(E_MODE.MIX);
                        }
                        else {
                            setMode(E_MODE.EDIT);
                            editWidget.setMode(editWidget.E_MODE.gate);
                        }
                        break;
                    case 42: //pan
                        if (mode == E_MODE.EDIT && editWidget.mode == editWidget.E_MODE.dyn) {
                            setMode(E_MODE.MIX);
                        }
                        else {
                            setMode(E_MODE.EDIT);
                            editWidget.setMode(editWidget.E_MODE.dyn);
                        }
                        break;
                    case 43: // plugin
                        if (mode == E_MODE.EDIT && editWidget.mode == editWidget.E_MODE.fx) {
                            setMode(E_MODE.MIX);
                        }
                        else {
                            setMode(E_MODE.EDIT);
                            editWidget.setMode(editWidget.E_MODE.fx);
                        }
                        break;
                    case 44: //eq

                        if (mode == E_MODE.EDIT && editWidget.mode == editWidget.E_MODE.aux) {
                            setMode(E_MODE.MIX);
                        }
                        else {
                            setMode(E_MODE.EDIT);
                            editWidget.setMode(editWidget.E_MODE.aux);
                        }
                        break;
                    //case 45: //instr
                    case 46: //bank left
                        leftFader = leftFader - 8;
                        if (leftFader < 0) {
                            leftFader = 0;
                        }
                        updateFaders();
                        console.log("leftFader " + leftFader);
                        break;

                    case 47: //bank right
                        leftFader = leftFader + 8;
                        if (leftFader > 16) {
                            leftFader = 16;
                        }
                        updateFaders();
                        console.log("leftFader " + leftFader);
                        break;

                    case 48: //chanel right
                        leftFader = leftFader + 1;
                        if (leftFader > 16) {
                            leftFader = 16;
                        }
                        updateFaders();
                        console.log("leftFader " + leftFader);
                        break;

                    case 49: //chanel left
                        leftFader = leftFader - 1;
                        if (leftFader < 0) {
                            leftFader = 0;
                        }
                        updateFaders();
                        console.log("leftFader " + leftFader);
                        break;
                    case 50: //flip
                        break;
                    case 51: //global view
                        setMode(E_MODE.MIX);
                        updateFaders();
                        break;
                    // case 52:
                    // case 53:
                    case 54:
                    case 55:
                    case 56:
                    case 57:
                    case 58:
                    case 59:
                    case 60:
                    case 61:
                        break;

                    case 62:
                        setMode(E_MODE.GAIN);
                        break;
                    case 63:
                        if (mode == E_MODE.AUX) {
                            if (auxWidget.mode <= 8) {
                                auxWidget.setMode(auxWidget.mode + 1);
                            }
                            else {
                                auxWidget.setMode(0);
                            }
                        }
                        else {
                            setMode(E_MODE.AUX);
                        }
                        break;
                    case 64:
                        if (mode == E_MODE.FXSENDS) {
                            if (fxSendsWidget.mode <= 2) {
                                fxSendsWidget.setMode(fxSendsWidget.mode + 1);
                            }
                            else {
                                fxSendsWidget.setMode(0);
                            }
                        }
                        else {
                            setMode(E_MODE.FXSENDS);
                        }
                        break;
                    case 65:
                        setMode(E_MODE.PLAYER);
                        break;
                    case 66:
                        setMode(E_MODE.SETTINGS);
                    default:
                        break;

                }
            }
        case 0xB0: //CC
            if (channel == 0) {
                if (midiData[1] >= 0x10 && midiData[1] <= 0x17) //vpots
                {
                    switch (mode) {
                        case E_MODE.MIX:
                        case E_MODE.AUX:
                        case E_MODE.MODALS:
                            string = faderString + (midiData[1] - 0x10 + leftFader) + "." + auxString + "pan";
                            break;
                        case E_MODE.EDIT:
                            switch (editWidget.mode) {
                                case editWidget.E_MODE.eqch:
                                    switch (editWidget.pages[editWidget.E_MODE.eqch].mode) {
                                        case 0:
                                            if (midiData[1] == 0x11) {
                                                string = selectedStrip.name + "eq.hpf.freq";
                                                break;
                                            }
                                        //todo slope
                                        case 1:
                                        case 2:
                                        case 3:
                                        case 4:
                                            if (midiData[1] == 0x11) {
                                                string = selectedStrip.name + "eq.b" + (editWidget.pages[editWidget.E_MODE.eqch].mode) + ".freq";
                                                break;
                                            }
                                            else if (midiData[1] == 0x12) {
                                                string = selectedStrip.name + "eq.b" + (editWidget.pages[editWidget.E_MODE.eqch].mode) + ".q";
                                                break;
                                            }
                                            else if (midiData[1] == 0x13) {
                                                string = selectedStrip.name + "eq.b" + (editWidget.pages[editWidget.E_MODE.eqch].mode) + ".gain";
                                                break;
                                            }
                                        case 5:
                                            if (midiData[1] == 0x11) {
                                                string = selectedStrip.name + "eq.lpf.freq";
                                                break;
                                            }
                                            if (midiData[1] == 0x10) //left VPOT
                                            {
                                                string = "";
                                                if (midiData[2] == 1) //clockwise
                                                {
                                                    setNextEQMode();
                                                }
                                                else if (midiData[2] == 65) {
                                                    setPrevEQMode();
                                                }
                                            }
                                            break;
                                        default:
                                            break;

                                    }//switch eq pages mode
                                    break;
                                case editWidget.E_MODE.aux:
                                    string = selectedStrip.name + "aux." + (midiData[1] - 0x10) + ".value";
                                    break;
                                case editWidget.E_MODE.gate:
                                    string = selectedStrip.name + "gate.";
                                    switch (midiData[1]) {
                                        case 0x10:
                                            string = string + "thresh";
                                            break;
                                        case 0x11:
                                            string = string + "attack";
                                            break;
                                        case 0x12:
                                            string = string + "hold";
                                            break;
                                        case 0x13:
                                            string = string + "release";
                                            break;
                                        case 0x14:
                                            string = string + "depth";
                                            break;
                                        //todo bypass
                                        default:
                                            string = "";
                                            break;
                                    } //switch midiData[1]
                                    break;
                                case editWidget.E_MODE.dyn:
                                    string = selectedStrip.name + "dyn.";
                                    switch (midiData[1]) {
                                        case 0x10:
                                            string = string + "threshold";
                                            break;
                                        case 0x11:
                                            string = string + "ratio";
                                            break;
                                        case 0x12:
                                            string = string + "attack";
                                            break;
                                        case 0x13:
                                            string = string + "release";
                                            break;
                                        case 0x14:
                                            string = string + "outgain";
                                            break;
                                        //todo other params
                                        default:
                                            string = "";
                                            break;
                                    } //switch midiData[1]
                                    break;
                                default:
                                    break;


                            } //switch editWidget.mode
                            break;

                        case E_MODE.GAIN:
                            switch (midiData[1]) {
                                case 0x10:
                                    string = selectedStrip.defaultSRC + ".phantom";
                                    break;
                                case 0x11:
                                    string = selectedStrip.name + "invert";
                                    break;
                                case 0x12:
                                    string = selectedStrip.defaultSRC + ".hiz";
                                    break;
                                case 0x13:
                                    string = selectedStrip.name + "delay";
                                    break;
                                //todo other params
                                default:
                                    string = "";
                                    break;

                            }
                            //todo switch on/off
                            break;
                        default:
                            string = "";
                            break;
                    }


                    if (midiData[2] == 1 && string != "") //clockwise
                    {
                        incrementValue(string);
                    }
                    else if (midiData[2] == 65 && string != "") {
                        decrementValue(string);
                    }

                }//vpots


            }

        default:
            break;

    } //statusbyte



}

function onMIDIFailure() {
    console.log('Could not access your MIDI devices.');
}

function incrementValue(string) {
    if (getValue(string) < 0.99) {
        data = getValue(string) + 0.01;
    }
    else {
        data = 1;
    }
    console.log("incrementValue " + string + " " + data);
    origSetValue(string, data);
    updateByKey(string);
}

function decrementValue(string) {
    if (getValue(string) > 0.01) {
        data = getValue(string) - 0.01;
    }
    else {
        data = 0;
    }
    console.log("decrementValue " + string + " " + data);
    origSetValue(string, data);
    updateByKey(string);
}

function setNextEQMode() {
    if (editWidget.pages[editWidget.E_MODE.eqch].mode <= 4) {
        editWidget.pages[editWidget.E_MODE.eqch].setMode(editWidget.pages[editWidget.E_MODE.eqch].mode + 1);
    }
    else {
        //editWidget.pages[editWidget.E_MODE.eqch].setMode(0);
    }
}

function setPrevEQMode() {
    if (editWidget.pages[editWidget.E_MODE.eqch].mode >= 1) {
        editWidget.pages[editWidget.E_MODE.eqch].setMode(editWidget.pages[editWidget.E_MODE.eqch].mode - 1);
    }
    else {
        //editWidget.pages[editWidget.E_MODE.eqch].setMode(5);
    }
}

function updateFaders() {
    updateStrings();
    var i;
    for (i = 0; i < 8; i++) {
        var faderValue = getValue(faderString + (leftFader + i) + "." + auxString + mixString);

        sendMIDIMessage([0xE0 + i, ((faderValue * 16383) & 0x7F), ((faderValue * 127) & 0x7F)]);
        if (getValue(faderString + (leftFader + i) + "." + auxString + "solo")) {
            sendMIDIMessage([0x90, 8 + i, 127]);
        }
        else {
            sendMIDIMessage([0x90, 8 + i, 0]);
        }
        if (getValue(faderString + (leftFader + i) + "." + auxString + "mute")) {
            sendMIDIMessage([0x90, 16 + i, 127]);
        }
        else {
            sendMIDIMessage([0x90, 16 + i, 0]);
        }
        if (selectedStrip.id == (i + leftFader)) {
            sendMIDIMessage([0x90, 24 + i, 127]);
        }
        else {
            sendMIDIMessage([0x90, 24 + i, 0]);
        }

    }

}

function updateThisFader(a, b) {
    if (a[0] == "i" || a[0] == "m") {
        d = a.split(".");
        console.log(d);
        if (d[1] >= leftFader || d[1] < leftFader + 8) {
            switch (d.last()) {

                case mixString:
                    var faderValue = b;
                    sendMIDIMessage([0xE0 + parseInt(d[1]), ((faderValue * 16383) & 0x7F), ((faderValue * 127) & 0x7F)]);
                    break;
                case "solo":
                    if (b) sendMIDIMessage([0x90, 8 + parseInt(d[1]), 127]);
                    else sendMIDIMessage([0x90, 8 + parseInt(d[1]), 0]);
                    break;
                case "mute":
                    if (b) sendMIDIMessage([0x90, 16 + parseInt(d[1]), 127]);
                    else sendMIDIMessage([0x90, 16 + parseInt(d[1]), 0]);
                    break;
                default:
                    break;

            }
        }
    }

}

function updateStrings() {
    switch (mode) {
        case E_MODE.AUX:
            faderString = "i.";
            auxString = "aux." + auxWidget.mode + ".";
            mixString = "value"
            break;
        case E_MODE.FXSENDS:
            faderString = "i.";
            auxString = "fx." + fxSendsWidget.mode + ".";
            mixString = "value"
            break;
        case E_MODE.GAIN:
            faderString = "hw.";
            auxString = "";
            mixString = "gain";
            break;
        default:
            faderString = "i.";
            auxString = "";
            mixString = "mix";
            break;

    }
}

var origPutValue = putValue;
putValue = function (a, b) {
    console.log("MIDI: putValue " + a + " " + b);
    origPutValue(a, b);
    updateThisFader(a, b);
}


var origSetValue = setValue;
setValue = function (a, b) {
    console.log("MIDI: setValue")
    origSetValue(a, b);
    updateThisFader(a, b);
}

var origSetMode = setMode;
setMode = function (a, b) {
    console.log("MIDI setMode");
    origSetMode(a, b);
    updateFaders();
    if (editWidget) {
        origEditWidgetSetMode = editWidget.setMode;
        editWidget.setMode = function (a, b, c) {
            console.log("MIDI editWidgetSetMode");
            //TODO find better solution
            if (this.mode != a)
            if (-1 == a) {
              for (var b = 0; b < this.pages.length; b++) this.pages[b].hide();
              regUpdate(this);
            } else if (
              "undefined" != typeof this.buttons &&
              "undefined" != typeof this.buttons[a] &&
              this.buttons[a].enabled
            ) {
              this.mode = a;
              for (b = 0; b < this.pages.length; b++)
                this.pages[b].enabled && this.pages[b].hide();
              this.pages[a].show();
              this.color = this.buttons[a].color;
              topWidget.bEDIT.clr1 = this.buttons[a].color;
              regUpdate(topWidget);
              regUpdate(bottomWidget);
              regUpdate(this);
            }
            updateFaders();

        }
    }
    if (auxWidget) {
        auxWidget.setMode = function (a, b, c) {
            console.log("MIDI auxWidgetSetMode");
            //TODO find better solution
            c = c || !1;
            if (
              !(
                (this.mode == a && !b) ||
                0 > a ||
                a >= curSetup.aux ||
                (hideHPAUX && a > curSetup.aux - 3)
              )
            ) {
              this.mode = a;
              auxoutWidget.setAux(a);
              if (HAVE_MATRIX && auxStrips[this.mode].getNameValue("matrix")) {
                this.page.hide();
                this.page2.show();
                this.page2.auxID = a;
                for (b = 0; b < mtxSendStrips.length; b++)
                  mtxSendStrips[b].setMode(a);
                this.page2.arrangeStrips();
              } else {
                this.page.show();
                HAVE_MATRIX && this.page2.hide();
                this.page.auxID = a;
                for (b = 0; b < this.page.strips.length; b++)
                  this.page.strips[b].setMode(a);
                this.page.arrangeStrips();
                HAVE_MATRIX && this.page2.arrangeStrips();
              }
              c || bottomWidget.upd();
              this.syncOffset();
              bottomWidget.update();
              regUpdate(this);
            }
            updateFaders();
        }
    }
}
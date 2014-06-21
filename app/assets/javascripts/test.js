/*

  Note that this file is just an example.  It should not be treated as
  part of Ymacs itself.  Ymacs is just an editing platform and as such
  it has no menus, no toolbar etc.  These can be easily added using
  other DynarchLIB widgets, as this file demonstrates.

  If a collection of useful menus/toolbars will emerge, a new compound
  widget will be defined.

*/

$(document).ready(function() {
    var desktop = new DlDesktop({});
    desktop.fullScreen();

    function print(obj) {
        var a = [], i;
        for (i in obj) {
            var val = obj[i];
            if (val instanceof Function)
                val = val.toString();
            else
                val = DlJSON.encode(val);
            a.push(DlJSON.encode(i) + " : " + val);
        }
        return a.map(function(line){
            return line.replace(/^/mg, function(s) {
                return "        ";
            });
        }).join("\n");
    };

    var info = ( "Existing keybindings:\n\n" +
                 print(Ymacs_Keymap_Emacs().constructor.KEYS)
                 + "\n\nHave fun!\n" );

    try {
        var dlg = new DlDialog({ title: "Ymacs", resizable: true });
        var javascript = new Ymacs_Buffer({ name: "consultant.js" });

        javascript.setCode("\
// Jacob O'Donnell Consulting\n\
// Professional Polyglot Programmer\n\
// Emacs lover\n\
// \n\
// jacobodonnell@gmail.com\n\
\n\
function Consultant() {\n\
\n\
}\
");

        javascript.cmd("javascript_dl_mode");
        javascript.setq("indent_level", 4);

        var keys = new Ymacs_Buffer({ name: "keybindings.txt" });
        keys.setCode(info);

        var layout = new DlLayout({ parent: dlg });

        var empty = new Ymacs_Buffer({ name: "empty" });
        var ymacs = window.ymacs = new Ymacs({ buffers: [ javascript, empty ] });
        ymacs.setColorTheme([ "dark", "billw" ]);
        ymacs.getActiveFrame().setStyle({ fontFamily: "Andale Mono", fontSize: "14px" });
        
        try {
            ymacs.getActiveBuffer().cmd("eval_file", ".ymacs");
        } catch(ex) {}


        try {
            //ymacs.getActiveBuffer().cmd("toggle_line_numbers"); // causes an error
        } catch(a) {}

        layout.packWidget(ymacs, { pos: "bottom", fill: "*" });

        dlg._focusedWidget = ymacs;
        dlg.setSize({ x: 800, y: 600 });

        // show two frames initially
        // ymacs.getActiveFrame().hsplit();

        dlg.show(true);
        dlg.maximize(true);

    } catch(ex) {
        //console.log(ex);
    }

    DynarchDomUtils.trash(document.getElementById("x-loading"));

    if (!is_gecko && !is_khtml) (function(){

        var dlg = new DlDialog({
            title   : "Information",
            modal   : true,
            quitBtn : "destroy"
        });

        var vbox = new DlVbox({ parent: dlg, borderSpacing: 5 });
        var tmp = new DlWidget({ parent: vbox });
        tmp.getElement().appendChild(document.getElementById("browser-warning"));
        var ok = new DlButton({ parent: vbox, focusable: true, label: "OK, let's see it" });
        ok.addEventListener("onClick", dlg.destroy.$(dlg));
        dlg._focusedWidget = ok;

        dlg.show(true);

    })();

    function setTimeoutInRandom(func) {
        var randomTime = Math.floor(Math.random() * 40) + 70;
        setTimeout(func, randomTime);
    }

    function insertChar(character) {
        var event = document.createEvent("Event");
        event.charCode = character.charCodeAt(0);
        ymacs.getActiveFrame()._on_keyPress(event);
    }

    
    function setTimeoutInsertChar(char, cb) {
        setTimeoutInRandom(function () {
            insertChar(char);
            cb();
        });
    }

    function setTimeoutInsertString(string, callback) {
        var funcs = [];
        for (var i = 0; i < string.length; i++) {
            (function () {
                var currentLetter = string[i];
                funcs.push(function(cb) {setTimeoutInsertChar(currentLetter, cb)});
            })()
        }
        async.series(funcs, function () {
            callback();				    
        })
    }

    function setTimeoutCommand(cmd, cb) {
        setTimeoutInRandom(function () {
            ymacs.getActiveBuffer().cmd(cmd);
            cb();
        });
    }
    
    async.series([
        function (cb) {
            setTimeout(function () {
                ymacs.getActiveBuffer().cmd('isearch_forward');
                cb();
            }, 1000);
        }, function (cb) {
            setTimeoutInsertString('fu', cb);
        }, function (cb) {
            setTimeoutCommand('isearch_abort', cb);
        }, function (cb) {
            setTimeoutCommand('forward_line', cb);
        }, function (cb) {
            setTimeoutCommand('indent_line', cb);
        }, function (cb) {
            setTimeoutInsertString('this.name = \'Jacob\';', cb);
        }, function (cb) {
            setTimeoutCommand('newline', cb);
        }, function (cb) {
            setTimeoutCommand('indent_line', cb);
        }, function (cb) {
            setTimeoutInsertString('this.years_experience = 12;', cb);
        }, function (cb) {
            setTimeoutCommand('newline', cb);
        }, function (cb) {
            setTimeoutCommand('indent_line', cb);
        }, function (cb) {
            setTimeoutInsertString("this.languages = ['ruby', 'objective c', 'python', 'javascript'];", cb);
        }, function (cb) {
            setTimeoutCommand('end_of_buffer', cb);
        }, function (cb) {
            setTimeoutCommand('newline', cb);
        }, function (cb) {
            setTimeoutCommand('newline', cb);
        }, function (cb) {
            setTimeoutInsertString("Consultant.prototype = {", cb);
        }, function (cb) {
            setTimeoutCommand('newline', cb);
        }, function (cb) {
            setTimeoutCommand('newline', cb);
        }, function (cb) {
            setTimeoutInsertString("}", cb);
        }
    ])
});

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
            ymacs.getActiveBuffer().cmd("toggle_line_numbers"); // causes an error
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

    function simulateKeyPress(character) {
        jQuery.event.trigger({ type : 'keypress', which : character.charCodeAt(0) });
    }

    setTimeout(function () {
        var event = document.createEvent("Event");
        //event.initKeyboardEvent("keypress", true, true, 69, false, false, false, false, 69, 0);
        event.charCode = 69;
        //ymacs.getActiveFrame()._on_keyPress(event);
        //ymacs.getActiveBuffer()._handleKeyEvent({charCode: 69, ctrlKey: false, altKey: false, shiftKey: false});
        ymacs.getActiveBuffer()._handleKeyEvent(event);

    }, 1000);    
});

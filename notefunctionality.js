    var links = new Array();
    var linkAmount = 0;
    
    function createNoteHTML(linkIndex) {
        var noteObject = links[linkIndex];
        var $newNote = "<section class='note' data-id='" +noteObject.id + "'><a target='_blank' href='" + noteObject.link + "'>" + noteObject.name +  "  </a></section>";
        
        return $newNote;
    }

    function addNote(linkJSON) {
        links.push(linkJSON);
        linkAmount++;
    }
    
    function deleteNote(linkID) {
        links.splice(linkID, 1);
        linkAmount--;
        
        if(linkAmount > linkID) {
            for(var i = linkID; i < linkAmount; i++) {
                links[i].id = i;
            }
        }
    }
    
$(document).ready(function() {
    var $header = $('header');
    
    var $startNote = $("input[name='startnote']");
    var $newNote = $(".newnote");
    var $addNote = $("input[name='addnote']");
    
    var $noteName = $("input[name='name']");
    var $noteLink = $("input[name='link']");
    
    var $section = $('.notes');
    var newNoteOpen = false;
    
    $(document).keypress(function(e) {
        $focusedElement = $(":focus");
        
        if(e.which == 13) {
            if($focusedElement[0] != $startNote[0] && $focusedElement[0] != $addNote[0]) {
                if(newNoteOpen) {  
                    if($noteName.val() != "" && $noteLink.val() != "") {
                        addNewNote();
                    } else {
                        toggleNewNote();   
                    }
                } else {
                    toggleNewNote();   
                }
            }
        }
    });
    
    $(document).keyup(function(e) {
        if(e.which == 27 && newNoteOpen) {
            toggleNewNote();
        }
    });

    
    $startNote.click(toggleNewNote);
    $addNote.click(addNewNote);
    
    function toggleNewNote() {
        newNoteOpen = !newNoteOpen;
        $startNote.toggle();
        $header.toggleClass("opposite");
        $newNote.toggle();
        
        if(newNoteOpen) {
            $noteLink.focus();
        } 
    }
    
    function addNewNote() {
        console.log("called");
        var newNoteName =  $noteName.val();
        var newNoteLink = $noteLink.val();
        
        if(newNoteName != "" && newNoteLink != "") {
            if(newNoteLink.substr(0, 6).toUpperCase() != "http://".toUpperCase()) {
                newNoteLink = "http://" + newNoteLink;
            }
            
            var newNote = {name: newNoteName, link:newNoteLink, id:linkAmount};
            
            addNote(newNote);
            $section.html(createNoteHTML(linkAmount-1) + $section.html());
            
            toggleNewNote();
            $("input[name='name']").val("");
            $("input[name='link']").val("");
        } else {
            toggleNewNote();
        }
    }

});
    var links = new Array();
    var linkAmount = 0;
    
    function createNoteHTML(linkIndex) {
        var noteObject = links[linkIndex];
        var $newNote = "<section class='note' data-id='" +noteObject.id + "'><a target='_blank' href='" + 
                                                          noteObject.link + "'>" + noteObject.name +  "  </a></section>";

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
    $("input[name='startnote']").on('click', function() {
        $('.newnote').toggle();
    });
    
    
    $("input[name='addnote']").on('click', function() {
        var newNoteName =  $("input[name='name']").val();
        var newNoteLink = $("input[name='link']").val();
        
        if(newNoteName != "name" & newNoteLink != "http://") {
            var newNote = {name: newNoteName, link:newNoteLink, id:linkAmount};
            var $section = $('.notes');
            
            addNote(newNote);
            $section.append(createNoteHTML(linkAmount-1));
        }
    });

});
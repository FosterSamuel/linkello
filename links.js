// Credit goes to Burke Holland for the code below that maps "$" to querySelector().
// | source: http://modernweb.com/2013/05/06/5-things-you-should-stop-doing-with-jquery/
// This is used to aid my removal of jQuery dependency in Linkello. 

window.$ = function(selector) { return document.querySelector(selector); };

// -----------------------------------------------------------------------------------//

var links = new Array();
var linkAmount = 0;
var linkID = 0;

var header = $('header');
var inputArea = $('.inputarea');
var startNote = $("input[name='startnote']");
var newNote = $(".newnote");
var addNote = $("input[name='addnote']");

var noteName = $("input[name='name']");
var noteLink = $("input[name='link']");
var noteSection = $("select[name='section']");

var sectionChild = $('.section-red section');
var newNoteOpen = false;
var lastNoteSection = "red";

function createNoteHTML(linkIndex) {
    var noteObject = links[linkIndex];
    var newNote = "<section class='note' index='" +noteObject.arrayIndex + "'>"
       newNote += "<a target='_blank' href='" + noteObject.link + "'>" + noteObject.name +  "  </a>";
       newNote += "<button class='kebab' onclick='showInfo(this)'><figure></figure><figure></figure><figure></figure></button>";
       newNote += "<div class='moreinfo hidden'>";
       newNote += "     <p>Added: " +  new Date().toJSON().slice(0,10) + "</p>";
       newNote += "     <button onclick='deleteLink(this)'>delete</button>";
       newNote += "</div>";
       newNote += "</section>";
    return newNote;
}
function newNoteDiv(sectionName) {
   return "<div class='notes section-" + sectionName + "'></div>";
}

function addNoteToArray(linkJSON) {
    links.push(linkJSON);
    linkID++;
    linkAmount++;
}
function deleteNote(specificLinkID) {
    links.splice(specificLinkID, 1);
    linkAmount--;

    if(linkAmount > specificLinkID) {
        for(var i = specificLinkID; i < linkAmount; i++) {
            links[i].arrayIndex = i;
        }
    }
}

addNoteToArray({name: "Easy Development Docs", link:"http://devdocs.io", id:linkID, arrayIndex: linkAmount, section:"red"});
addNoteToArray({name: "Cool Soundtrack", link:"https://lifeformed.bandcamp.com/album/fastfall", id:linkID, arrayIndex: linkAmount, section:"orange"});
addNoteToArray({name: "Github", link:"http://www.github.com/fostersamuel", id:linkID, arrayIndex: linkAmount, section:"green"});

console.log(links[2]);

startNote.addEventListener('click', toggleNewNote); 
addNote.addEventListener('click', addNewNote);

function toggleNewNote() {
    newNoteOpen = !newNoteOpen;

    startNote.classList.toggle('hidden');
    header.classList.toggle('opposite');
    newNote.classList.toggle('hidden');

    if(newNoteOpen) {
        noteLink.focus();
    } 
}
function addNewNote() {
    var newNoteName =  noteName.value;
    var newNoteLink = noteLink.value;
    var newNoteSection = noteSection.value;

    if(newNoteName != '' && newNoteLink != '') {
        if(newNoteLink.substr(0, 6).toUpperCase() != 'http://'.toUpperCase()) {
            newNoteLink = "http://" + newNoteLink;
        }

        addNoteToArray({name: newNoteName, link: newNoteLink, id: linkID, arrayIndex: linkAmount, section: newNoteSection});

        if(newNoteSection != lastNoteSection) {
            sectionChild = $('.section-' + newNoteSection + ' section');
            lastNoteSection = newNoteSection;
        }

        if (sectionChild == null || sectionChild.parentElement == null) {
            inputArea.insertAdjacentHTML('afterEnd', newNoteDiv(newNoteSection));
            $('.section-'+newNoteSection).innerHTML = createNoteHTML(linkAmount-1);
            sectionChild = $('.section-' + newNoteSection + ' section');
        } else {
            sectionChild.insertAdjacentHTML('beforeBegin', createNoteHTML(linkAmount-1));
        }
        
        toggleNewNote();
        noteName.value = '';
        noteLink.value = '';
    } else {
        toggleNewNote();
    }
}

document.addEventListener('keypress', function(e) {
    var key = e.keyCode || e.which;
    focusedElement = $(":focus");

    if(key == 13) {
        if(focusedElement != startNote && focusedElement != addNote) {
            if(focusedElement != null && focusedElement.classList != "kebab" && focusedElement.classList != "deletebutton" ) {
                if(newNoteOpen) {  
                    if(noteName.value != "" && noteLink.value != "") {
                        addNewNote();
                    } else {
                        toggleNewNote();   
                    }
                } else {
                    toggleNewNote();   
                }
            } else if(focusedElement == null) {
                if(newNoteOpen) {  
                if(noteName.value != "" && noteLink.value != "") {
                    addNewNote();
                } else {
                    toggleNewNote();   
                }
            } else {
                    toggleNewNote();   
                }
            }
        }
    }
});

document.addEventListener('keyup', function(e) {
    var key = e.keyCode || e.which;
    if(key == 27 && newNoteOpen) {
        toggleNewNote();
    }
});

function showInfo(index) {
    if(index.parentNode.childNodes[2].classList != null) {
        index.parentNode.childNodes[2].classList.toggle('hidden');
    } else {
        index.parentNode.childNodes[5].classList.toggle('hidden');
    }
}
function deleteLink(index) {
    var noteArea = index.parentNode.parentNode.parentNode;
    var specificSection = index.parentNode.parentNode;
    
    if(noteArea.childElementCount != 1) {
        noteArea.removeChild(specificSection);
    } else {
        if(noteArea.getAttribute('class').substr(14, 10) == lastNoteSection) {
            sectionChild = null;
        }
        deleteNote(specificSection.getAttribute('index'));
        noteArea.parentNode.removeChild(noteArea);
    }
}
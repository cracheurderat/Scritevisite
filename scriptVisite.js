function ProfileLinkGetter(domElement){
    this.domElement = domElement;
    this.links = [];
}

ProfileLinkGetter.prototype = {
    getLinks: function (){
        var self = this;
        $(this.domElement)
            .find(".online_prof")
            .each(function(key, divProfile){ 
                self.links.push(divProfile.firstElementChild.getAttribute("href"))  
            });
        return self.links;
    },
}


function ProfileVisitorEngine(profileLinkGetter){
    this.linksToVisit = profileLinkGetter.getLinks();
    this.requestedLink = [];
}

ProfileVisitorEngine.prototype = {
    visitProfiles: function (){
        this.requestedLink = this.linksToVisit
                                 .slice()
                                 .map($.ajax);
        var getVisited = this.getVisitedLinks().bind(this);
        $.when.apply($, this.requestedLink)
              .then(getVisited,getVisited);
    },

    getVisitedLinks: function(request){
        console.log(this.requestedLink.status());
    }
}

var visitor = new ProfileVisitorEngine(new ProfileLinkGetter(document.body));
visitor.visitProfiles();


function visitNewProfiles(){
    $.ajax(window.location.href)
        .then(parseResult)
        .then($)
        .then(getProfilesLink)
        .then(visitProfiles);
}

function parseResult(htmlResponse){
    return new DOMParser().parseFromString(htmlResponse, "text/html"); 
}

visitNewProfiles();
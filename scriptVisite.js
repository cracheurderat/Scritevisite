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
    this.visitedLinks = []
    localStorage.setItem('visited',JSON.stringify([]));
}

ProfileVisitorEngine.prototype = {
    visitProfiles: function (){
        this.requestedLink = this.getVisitableProfiles();
        console.log("ICI = " + this.requestedLink);
        this.requestedLink = this.linksToVisit
                                 .slice()
                                 .map($.ajax);
        var getVisited = this.getVisitedLinks.bind(this);
        $.when.apply($, this.requestedLink)
              .then(getVisited, getVisited)
              .always(this.setVisitedProfilesInLocalStorage);
    },

    getVisitedLinks: function(request){
        this.visitedLinks = this.linksToVisit.slice();
        this.requestedLink.forEach(function(request, index){
            if(request.status != 200)
                this.visitedLinks.splice(index, 1);
        });
        return this.visitedLinks;
    },

    setVisitedProfilesInLocalStorage: function(visitedProfiles){
        var visitedProfilesLS = JSON.parse(localStorage.getItem("visited")) || [];
        console.log("POPO = " + visitedProfiles);
        console.log("PIPI = " + visitedProfilesLS);
        console.log("PEPE = " + localStorage.getItem("visited"));
        console.log("PAPA = " + JSON.stringify(visitedProfilesLS.concat(visitedProfiles)));
        localStorage.setItem('visited',
                         JSON.stringify(visitedProfiles.concat(visitedProfilesLS)));
    },

    getVisitableProfiles: function(){
        var visitedProfiles = JSON.parse(localStorage.getItem("visited")) || [];
        console.log(visitedProfiles);
        return this.linksToVisit
                   .filter(function(link){
                       return !visitedProfiles.includes(link)
                   });
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
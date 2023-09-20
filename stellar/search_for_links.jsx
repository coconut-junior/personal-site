//written 2023 by Jimmy Blanck
//must be run from the User script folder

//to do:
//make compatible with windows

app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;

var i, j, searchfolder;  
var w = new Window("palette", "Progress", undefined, {closeButton: false});
var status = w.add("statictext");
status.preferredSize = [400, -1];

//original folder structure
var originalFolder = '1_creative_design_dept'; //old root dir
var originalSubdir = '/corporate_assets';

function getUsername() {
    var scriptPath = Folder(File($.fileName).path).fsName;
    var user = scriptPath.toString().split('/')[2];
    return user;
}

function getRelativePath(path) {
    var scriptPath = Folder(File($.fileName).path).fsName;
    var user = scriptPath.toString().split('/')[2];
    var newPath = path.split('/');
    newPath[2] = user;
  
    return newPath.join('/');
}

doc = app.activeDocument;
imgs = doc.links;
// path = Folder.selectDialog ("Select a Folder");  // type here the path for the folder to start
// searchfolder = new Folder(path);
var missingPre = 0;
var missingPost = 0;

w.show();

//search root of all onedrive sites
var cloudStorage = '/Users/' + getUsername() + '/Library/CloudStorage';
var sharepointSites = Folder(cloudStorage).getFiles(function(item) { return item instanceof Folder; });
var oneDrive = '';
for(var i = 0;i<sharepointSites.length;++i) {
    if(sharepointSites[i].fsName.match('OneDrive')) {
        oneDrive = sharepointSites[i].fsName;
    }
}
var sharepointPages = Folder(oneDrive).getFiles(function(item) { return item instanceof Folder; });


for (i=0; i<imgs.length; i++)
{
    $.writeln("Image "+i);

    //search in user's sharepoint/onedrive folder
    if (imgs[i].status == LinkStatus.LINK_MISSING)  
    {  
        ++missingPre;

        if(imgs[i].linkResourceURI.match('Users')) {
            try {
                var path = getRelativePath(imgs[i].linkResourceURI);
                status.text = "Searching for " + imgs[i].name + " in " + path + "...";
                imgs[i].relink(path);
            }
            catch(e) {}
        }
        //link isnt where it should be, look somewhere else
        if (!Folder(imgs[i].linkResourceURI.replace(imgs[i].name,'')).exists) {
            var missingFolder = imgs[i].linkResourceURI;

            //link points to the old marketing drive
            var f = missingFolder.split(originalFolder)[1];
            try{
                f = f.replace(originalSubdir,'');
            }
            catch(e) {}
            if(missingFolder.match(originalFolder)) {
                relinkOriginal(f,i);
            }

            //link points to different sharepoint site
            try {
                var relativeSharepointPath = '/' + imgs[i].linkResourceURI.split('OneDrive')[1].split('/').slice(2).join('/');
                relinkOriginal(relativeSharepointPath,i);
            }
            catch(e) {}
        }

        //if link is still missing, seach in selected folder
        if (imgs[i].status == LinkStatus.LINK_MISSING)  
        {  
            
        }

        

    }  
}

for (i=0; i<imgs.length; i++)
{
    if (imgs[i].status == LinkStatus.LINK_MISSING)  
    {
        ++missingPost;
    }
}

w.close();
alert("Found & relinked " + (missingPre-missingPost) + " files.");

function getFiles (filename, path)  
{  
    var result, folderList, fl;  
    result = Folder(path).getFiles (filename+".*");
    status.text = "Searching for " + filename + " in " + path + "...";

    if (result.length > 0) {
        return result;
    }
    else {
        folderList = Folder(path).getFiles(function(item) { return item instanceof Folder && !item.hidden; });  

        for (fl=0; fl<folderList.length; fl++)  
        {
            $.writeln("Looking in: "+path+"/"+folderList[fl].name);
            result = getFiles (filename, path+"/"+folderList[fl].name);  

            if (result.length > 0)  {
                return result; 
            } 

        }  
    }

    return [];
}

function relinkOriginal(f,i) {

    while(f.match('%20')){f = f.replace('%20',' ');}

    for(var s = 0;s<sharepointPages.length;++s) {
        try {
            var path = sharepointPages[s].fsName + f;
            status.text = "Searching for " + imgs[i].name + " in " + path + "...";
            imgs[i].relink('file:' + path);
        }
        catch(e) {}
    }
}
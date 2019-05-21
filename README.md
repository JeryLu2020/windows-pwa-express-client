# Sample PWA app with Express Node.js

## Super simple to use

Live Demo:
https://windows-pwa-express.azurewebsites.net/

## Table of contents

- [Folder Structure](#FolderStructure)
- [Manifest](#Manifest)
- [Service Worker](#Service-Worker)
- [Deploy To Azure](#Deploy)
- [Offline Mode](#Offline-Mode)
---

## FolderStructure
```
SamplePWAwebapp
 | - public/
 | | - images/
 | | - stylesheets/
 | | - manifest.json
 | | - offline.html
 | | - pwabuilder-sw-register.js
 | | - pwabuilder-sw.js
 | - routes/
 | | - index.js
 | | - user.js
 | - views/
 | | - error.pug
 | | - index.pug
 | | - layout.pug
 | - app.js
 | - package.json
 | - web.config
```

Document reference:
- https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps/get-started
- https://docs.microsoft.com/en-us/labs/insiderdevtour2018/pwa/

## Manifest

- Go to [PWABuilder](https://preview.pwabuilder.com/) and fill in the azure web app url
- Go to Manifest page and fill in the required infromation
- Upload the image and copy the download the generated manifest.json

Put the generated images under /images folder and pay attention to below parameters in the manifest.json
```
"start_url": "/"
"display": "standalone"
```

---

## Service-Worker

- In the [PWABuilder](https://preview.pwabuilder.com/), locate to the Service Worker page
- Select the "Offline page", and click download

Go to [Download page](https://preview.pwabuilder.com/publish) and download the whole PWA files, the folder structure should be like this
```
SamplePWA-web
 | - projects
 | | - Assets
 | | - PWA
 | | | - Images
 | | | - generationInfo.json
 | | | - manifest.json
 | | | - Web-next-steps.md
 | | - serviceWorker1
 | | | - pwabuilder-sw.js
 | | | - pwabuilder-sw-register.js

```

---

## Deploy

Below configuraton has to be added in the web.config file
```
<configuration>
    <system.webServer>
        <staticContent>
            <remove fileExtension=".json"/>
            <mimeMap fileExtension=".json" mimeType="application/manifest+json"/>
        </staticContent>
    </system.webServer>
    <system.web>
        <compilation debug="true"/>
    </system.web>
</configuration>
```

## Offline-Mode

For offline mode, we have to set a offline html page to load.

### modify line 6 of pwabuilder-sw.js
```
const offlineFallbackPage = "/offline.html";
```
- Open Chrome Debug console and go to Application -> Manifest
![Image of Manifest](https://windows-pwa-test-update.azurewebsites.net/images/manifest.png)


- In Chrome Debug console, go to Application -> Service Workers, the Status should look green
![Image of service worker](https://windows-pwa-test-update.azurewebsites.net/images/serviceworker.png)

- Check the Offline box and refresh the page, the offline.html page will be loaded
![Image of offline](https://windows-pwa-test-update.azurewebsites.net/images/offline.png)

Feel free to turn off the network and test again.

[back to top](#table-of-contents)
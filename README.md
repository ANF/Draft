<h1 align="center" style="position: relative;">
    <a href="https://github.com/ANF-Studios/Draft"><img width="200" style="border-radius: 50%;"
            src="./src/images/display.png" /></a><br>
    Draft
</h1>

<h3 align="center">Draft, a small project by ANF-Studios<br>A simple application that manages all your notes</h3>

<p align="center">
    <a href="https://github.com/ANF/Draft/blob/master/LICENSE">License</a> •
    <a href="https://discord.gg/fKWpK7A">Discord Server</a> •
    <a href="https://github.com/ANF/Draft/releases/latest">Download</a> •
    <a href="https://github.com/ANF/Draft/blob/master/CHANGELOG.MD">Changelog</a>
</p>

<h2>About</h2>
<p>Draft was formerly known as ANFPad (and initially; List Manager). The development is active and the project is not abandoned.</p>

<h2 align="center">Using it</h2>
<p>You can grab the latest release of <a href="https://github.com/ANF/Draft">Draft</a> at the <a
        href="https://github.com/ANF/Draft/releases/latest">releases</a> section and run the installer like any
    other Electron application.<br /><strong>Note:</strong> At the moment, the GUI version is only a pre-release, so you
    would have to use that if you feel eager for it.</p>

<h3>I'm living on the Edge, give me the latest features</h3>
<p>You can simply grab a pre-release with the latest features or works that are under development. Keep in mind that
    things may break or appear unexpectedly.</p>

<h3>I want to compile my own version</h3>
<p>Well, you're in luck, there are two ways instructed in this file:</p>
<h4><strong>[RECOMMENDED]</strong> Using PowerShell</h4>
<p>Prerequisites:
    <a href="https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell">PowerShell</a>, <a
        href="https://git-scm.com/downloads">Git</a> and <a href="https://nodejs.org/en/download/">NodeJS</a>.
    Now save the following code in a <code>ps1</code> (such as <code>run_anfpad.ps1</code>) file and run it with
    PowerShell.
</p>

```ps1
$desktop = [Environment]::GetFolderPath("Desktop");
cd $desktop;
[Console]::Write("[GIT] Cloning respository...\n");
git clone https://github.com/ANF/Draft.git $desktop\Draft;
[Console]::Write("[NPM] Installing node_modules...\n");
npm install;
# Start Draft
[Console]::Write("[ELECTRONJS] Building Draft...\n");
npm run start;
[Console]::Write("[NPM] Starting...\n");
# Uncomment this part if you want an installer file.
# [Console]::Write("[ELECTRONJS] Creating installer...\n");
# npm run publish;
# [Console]::Write("[NPM] Created installer...");
# cd out\make\squirrel.windows\ia32;
# Invoke-Item .
```

<h4>Doing it manually</h4>
<ol>
    <li>Download the repo:</li>
    <a href="https://github.com/ANF/Draft/archive/master.zip"><img
            src="https://user-images.githubusercontent.com/68814933/103164783-7a4ad080-47dd-11eb-8796-bc45d5019b4f.png"
            alt="Download the repo"></img></a>
    <li>Extract the (downloaded) zip file.</li>
    <li>Open up a terminal such as command prompt.</li>
    <li><code>cd</code> into the directory you downloaded.</li>
    <li>Run <code>npm install && npm run start</code></li>
</ol>

<span align="center">
    <h1>Previews</h1>
    <h5>Light Theme</h5>
    <div>
        <img width="500" alt="Light Theme"
            src="https://user-images.githubusercontent.com/68814933/106282518-b1facd00-620e-11eb-80c9-15846dbe6311.png"> <!-- https://user-images.githubusercontent.com/42365887/103587106-21013200-4eac-11eb-9074-b057da4ae19d.png -->
    </div>
    <h5>Dark Theme</h5>
    <div>
        <img width="500" alt="Dark Theme"
            src="https://user-images.githubusercontent.com/68814933/106282518-b1facd00-620e-11eb-80c9-15846dbe6311.png"> <!-- https://user-images.githubusercontent.com/42365887/103587109-21013200-4eac-11eb-92ad-030d94ea5569.png -->
    </div>
    <h5>Monokai Theme</h5>
    <div>
        <img width="500" alt="Monokai Theme"
            src="https://user-images.githubusercontent.com/68814933/106282577-ca6ae780-620e-11eb-99fb-dbd91b84ae82.png"> <!-- https://user-images.githubusercontent.com/42365887/103587098-1e064180-4eac-11eb-89b1-db164061c77a.png -->
    </div>
    <h5>Markdown Renderer</h5>
    <div>
        <img width="500" alt="Markdown Renderer"
            src="https://user-images.githubusercontent.com/68814933/106282702-f71eff00-620e-11eb-8047-49677d04dbd5.png"> <!-- https://user-images.githubusercontent.com/42365887/103587101-1e9ed800-4eac-11eb-92b8-18d426b45519.png -->
    </div>
</span>

<h2 align="center">Further help</h2>
<p>You can <a href="https://github.com/ANF-Studios/ListManager/issues">create an issue</a> or just join the support
    server.</p>

<a href="https://discord.gg/fKWpK7A"><img
        src="https://discord.com/api/guilds/732064655396044840/embed.png?style=banner3"
        alt="Chat in the server"></img></a>

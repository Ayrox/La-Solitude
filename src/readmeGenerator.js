import fs from "fs";



const commandsFolder = fs.readdirSync("./src/Commands");


try {
    fs.unlinkSync("./README.md")
} catch (e) {
    console.log("no README file found")
}

fs.appendFile(
    "./README.md",
    `# La Solitude Discord Bot\n\n## Author\n\n-   [@Ayrox](https://github.com/Ayrox)\n\n## Contributors\n\n-   [@Syns369](https://github.com/Syns369)\n-   [@MightyPotatoast](https://github.com/MightyPotatoast)\n\n## Commands\n`,
    
    function (err) {
        if (err) {
            console.log(`${folder} failed to be added to the README.md`);
        } else {
            console.log(`ajout des credits`);
        }
    }
);

for (folder of commandsFolder) {
    const commandFiles = fs
        .readdirSync(`./src/Commands/${folder}`)
        .filter((file) => file.endsWith(".js"));
    fs.appendFile(
        "./README.md",
        `\n### ${folder}\n \n | name | Description | \n | :------ | :------ | \n `,
        function (err) {
            if (err) {
                console.log(`${folder} failed to be added to the README.md`);
            } else {
                console.log(`ajout du titre ${folder}`);
            }
        }
    );
    for (file of commandFiles) {
        const command = import(`./Commands/${folder}/${file}`);
        //console.info(command);
        fs.appendFile(
            "./README.md",
            `| \`${command.data.name}\` | \`${command.data.description}\` |\n`,
            function (err) {
                if (err) {
                    // append failed
                } else {
                    console.log(`ajout de la commande ${command.data.name}`);
                }
            }
        );
    }
}

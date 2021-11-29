//Include packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');

const generateMarkdown = require('./utils/generateMarkdown.js');

// TODO: Create an array of questions for user input
const questions = [
    {
        type: 'input',
        name: 'title',
        message: 'Please enter a project title (Required)',
        validate: nameInput => {
            if (nameInput) {
                return true;
            } else {
                console.log ('Please enter a project title');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'github',
        message: 'Please enter your GitHub username. (Required)',
        validate: githubInput => {
            if (githubInput) {
                return true;
            } else {
                console.log ('Enter GitHub username please');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'repo',
        message: 'Please enter name of your repo. (Required)',
        validate: repoInput => {
            if (repoInput) {
                return true;
            } else {
                console.log ('Please enter your repo name');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'description',
        message: 'Please enter description of your design. (Required)',
        validate: descriptionInput => {
            if (descriptionInput) {
                return true;
            } else {
                console.log ('Please enter a description');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'usage',
        message: 'Provide information for using this application. (Required)',
        validate: usageInput => {
            if (usageInput){
                return true;
            } else {
                console.log ('Please enter information for using this application.');
                return false;
            }
        }
    },
    //use checklist so that the readme can be tailored for each person instead of one option
    {
        type: 'checkbox',
        name: 'sections',
        message: 'Checkoff additonal sections you would like to add to your README.md file.',
        choices: [
            {
                name: 'Deployed Application',
                checked: false
            },
            {
                name: 'Installation',
                checked: false,
            },
            {
                name: 'Images',
                checked: true
            },
            {
                name: 'Built with',
                checked: true
            },
            {
                name: 'Licenses',
                checked: false
            },
            {
                name: 'Ways to Contribute',
                checked: false
            },
            {
                name: 'Tests',
                checked: false
            },
            {
                name: 'Questions',
                checked: true
            },
            {
                name: 'Contributors',
                checked: true
            },
        ]
    },
    {
        type: 'input',
        name: 'link',
        message: 'Enter link to your deployed application',
        when: ({ sections }) => {
            if (sections.indexOf('Deployed Application') > -1) {
                return true;
            } else {
                return false;
            }
        },
        validate: linkInput => {
            if (linkInput) {
                return true;
            } else {
                console.log ('Must enter a link');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'installation',
        message: 'List required packages for installation of your application',
        when: ({ sections }) => {
            if (sections.indexOf('Installation')> -1) {
                return true;
            } else {
                return false 
            }
        },
        validate: installationInput => {
            if (installationInput) {
                return true;
            } else {
                console.log ('Enter installation instructions');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'licenses',
        message: 'Provide any license information',
        when: ({ sections }) => {
            if (sections.indexOf('Licenses')> -1) {
                return true;
            } else {
                return false 
            }
        },
        validate: licensesInput => {
            if (licensesInput) {
                return true;
            } else {
                console.log ('Enter license information or N/A');
                return false;
            }
        }
    },
    {
        type: 'checkbox',
        name: 'built with',
        message: 'Select languages and technologies used for your application',
        choices: ['HTML', 'CSS', 'SASS', 'JavaScript', 'Node.js', 'Express.js'],
        default: 0,
        when: ({ sections }) => {
            if (sections.indexOf('Built With') > -1) {
                return true;
            } else {
                return false;
            }
        }
    }, 
    {
        type: 'input',
        name: 'contributing',
        message: 'Please enter your guidelines for contributing.',
        when: ({ sections }) => {
            if (sections.indexOf('Ways to Contribute') > -1) {
                return true;
            } else {
                return false;
            }
        },
        validate: contributingInput => {
            if (contributingInput) {
                return true;
            } else {
                console.log('Enter guidelines for contributing!');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'tests',
        message: 'Enter test information for your application.',
        when: ({ sections }) => {
            if (sections.indexOf('Tests') > -1) {
                return true;
            } else {
                return false;
            }
        },
        validate: testsInput => {
            if (testsInput) {
                return true;
            } else {
                console.log('What packages are required to run tests for your application?');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'questions',
        message: 'Please provide an email address for questions.',
        when: ({ sections }) => {
            if (sections.indexOf('Questions') > -1) {
                return true;
            } else { 
                return false;
            }
        },
        validate: questionsInput => {
            if (questionsInput) {
                return true;
            } else {
                console.log('Provide an email address');
                return false;
            }
        }
    }
];

//add an array to handle images/screenshots
const imageArea = [
    {
        type:' input',
        name: 'imageLink',
        message: 'Provide links for images and screenshots. (Required)',
        validate: imageInput => {
            if (imageInput) {
                return true;
            } else {
                console.log ('Add links to load images and screenshots')
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'imageAlt',
        message: 'Please provide alt text for your image/screenshots. (Required)',
        validate: altInput => {
            if (altInput) {
                return true;
            } else {
                console.log('Alt text required')
                return false;
            }
        }
    },
    {
        type: 'confirm',
        name: 'addImage',
        message: 'Would you like to add another image/screenshot?',
        default: false
    }
];

// ways to add multiple contributors
const contriArea = [
    {
        type: 'input',
        name: 'contributors',
        message: 'Please provide name or title of contributor or credit. (Required)',
        validate: contributorInput => {
            if (contributorInput) {
                return true;
            } else {
                console.log('Please enter name')
                return false
            }
        }
    },
    {
        type: 'input',
        name: 'contriLink',
        message: 'Provide link if needed. (Optional)'
    },
    {
        type: 'confirm',
        name: 'addContri',
        message: 'Would you like to add additional Contributor or Credit?',
        default: false
    }
]

//need to add ways to add function to adding screenshots
addShots = readmeData => {
    if (!readmeData.images) {
        readmeData.images = [];
    }
    console.log ('ADD NEW IMAGE');
    return inquirer.prompt(imageLink)
    .then(imageData => {
        readmeData.images.push(imageData);
        if (imageData.addImage) {
            return addShots(readmeData);
        } else {
            return readmeData;
        };
    });
};

//function to add contributors/credits
nextContri = readmeInfo => {
    if (readmeInfo.credits) {
        readmeInfo.credits = [];
    };
    console.log('ADD NEW CONTRIBUTOR/CREDIT');
    return inquirer.prompt(contriArea)
    .then(creditData => {
        readmeInfo.credits.push(creditData);
        if (creditData.addContri) {
            return nextContri(readmeInfo);
        } else {
            return readmeInfo;
        }
    });
};

// TODO: Create a function to write README file
function writeToFile(fileName, data) {
    fs.writeFile(`./dist/${fileName}`, data, err => {
        if (err) {
            throw err
        };
        console.log('README created!')
    });
};

// TODO: Create a function to initialize app
function init() {
    return inquirer.prompt(questions);
};

// Function call to initialize app
init() 
    .then(userResponse => { 
        if (userResponse.sections.indexOf('Images') > -1) {
            return addShots(userResponse);
        } else {
            return userResponse;
        }
    })
    .then(response => {
        if (response.sections.indexOf('Credits') > -1) {
            return nextContri(response);
        }   else {
            return response;
        }
    })
    .then(answers => generateMarkdown(answers))
    .then(generatedReadme => writeToFile('README.md', generatedReadme))
    .catch(err => {
        console.log(err);
    });

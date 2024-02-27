function generateProtocol(child, pastSessions) {
    // ---- Helper Functions ----
    // returns random coin flip as true or false
    function randomBoolean() {
        return Boolean(Math.floor(Math.random() * 2));
    }
    function randomItem(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

    // shuffles an array
    function shuffle(array) {
        var shuffled = Ember.$.extend(true, [], array); // deep copy array
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = temp;
        }
        return shuffled;
    }

    // ---- Define non-test trial frames

    var frames = {
        "welcome": {
            "kind": "exp-lookit-text",
            "blocks": [
                {
                    "emph": true,
                    "title": "Thank you for your interest in our study!",
                    "text": "Reminder: Your child does not need to be with you until the videos begin."
                },
                {
                    "text": "Here's a quick summary of what's about to happen:",
                    "listblocks": [
                        {
                            "text": "1. Webcam Setup and Video Consent. First, we'll be checking that your webcam is working. Then you and your child will give your consent to participate in this research."
                        },
                        {
                            "text": "2. Study Overview. Here, you will learn a little more about what your child will be doing in this study, along with some other important details about your role in the game."
                        },
                        { "text": "3. When you click the 'Start the game!' button on the Study Overview page, the study will begin! This study will take about 15 minutes in total." }
                    ]
                },
                { "text": "Thank you so much for helping us with our science! We hope you and your child have fun." }
            ],
            "showPreviousButton": false
        },
        "video-config": {
            "kind": "exp-video-config",
            "troubleshootingIntro": "If you're having any trouble or would like us to walk you through setup, please email michellewong@fas.harvard.edu"
        },
        "video-consent": {
            "kind": "exp-lookit-video-consent",
            "template": "consent_005",
            "PIName": "Michelle Wong",
            "institution": "Harvard University",
            "PIContact": "michellewong@fas.harvard.edu",
            "purpose": "We're interested in how children think about pretend play and what influences their pretend play preferences. Recent research has shown that children at play often invent novel goals, but we don't know how children actually decide which goals and which pretend scenarios to play with. In this study, we want to learn more about how children choose what to play, and how they creatively exercise their imagination.",
            "procedures": "Your child will see pictures of different places and objects to play pretend with. In part 1 of the study, we will ask your child to choose which object they would rather play with. In part 2 of the study, they will generate as many ideas as they can for what a given object could be in a pretend scenario.",
            "risk_statement": "There are no expected risks if you participate in the study.",
            "payment": "After you finish the study, we will email you a $5 Amazon gift card within approximately one week. To be eligible for the gift card, your child must meet all eligibility criteria (e.g., be in the age range for this study), you need to submit a valid consent statement, and we need to see that there is a child with you. Additionally, your child may only participate in this study once in order to be eligible for compensation. There may be multiple versions of this study posted over time, but only your first participation will count for compensation. However, even if you do not finish the whole study or we are not able to use your child's data, we will still send a gift card! There are no other direct benefits to you or your child from participating, but we hope you will enjoy the experience.",
            "datause": "We are primarily interested in the answers your child provides. A research assistant may also watch your videos to code any spontaneous speech your child generates during the task.",
            "include_databrary": true,
            "gdpr": false,
            "research_rights_statement": "You are not waiving any legal claims, rights or remedies because of your participation in this research study.  If you feel you have been treated unfairly, or you have questions regarding your rights as a research subject, you may contact Harvard's Committee on the Use of Human Subjects (cuhs@harvard.edu)."
        },
        "study-preview": {
            "kind": "exp-lookit-stimuli-preview",
            "doRecording": true,
            "requirePreview": false,
            "previewButtonText": "I'd like to preview the videos",
            "skipButtonText": "Skip preview",
            "blocks": [
                {
                    "emph": true,
                    "title": "Let's play pretend! Study overview"
                },
                {
                    "emph": true,
                    "text": "Reminder: Your child does not need to be with you until the videos begin. Now, let's go over what will happen in the study!"
                },
                {
                    "text": "There are two parts to this study:",
                    "listblocks": [
                        { "text": "1. Your child will first play a Choosing game. We will present 8 different pretend play scenarios. In each scene, your child will choose which object they would rather pretend with." },

                        {
                            "text": "2. Then, your child will play an Ideas game with the same images and objects. We'll ask your child to think out loud, and share as many ideas as they can for what they could pretend those objects to be."
                        }]
                },
                {
                    "text": "\nBefore we start, if you'd like, you can preview the sort of images that your child will see. Importantly, you should watch these example videos without your child."
                }
            ],
            "showPreviousButton": false,
            "baseDir": "https://raw.githubusercontent.com/wongmich/productive-pretense-lookit/choose-then-generate/",
            "videoTypes": ["webm", "mp4"],
            "stimuli": [
                {
                    "video": "PP Stimuli Preview Choose",
                    "caption": "In Part 1, your child will choose which object they would rather play pretend with. Here's an example of what the images and choices will look like:"
                },
                {
                    "video": "PP Stimuli Preview Generate",
                    "caption": "In Part 2, your child will generate as many ideas for what they could pretend an object to be. Here's an example of what the images and prompts will look like:"
                }
            ]
        },
        "study-instructions": {
            "kind": "exp-lookit-instructions",
            "blocks": [
                {
                    "title": "Parent's role",
                    "listblocks": [
                        {
                            "text": "Please allow your child to answer at their own pace. Don't give any hints or say whether you agree!"
                        },
                        {
                            "text": "In Part 1, your child just has to make a single choice. If your child can click on their own, let them click one of the answer choices, then click the Next button. If they can't click on their own, you can click for them."
                        },
                        {
                            "text": "You can always click 'Replay' to repeat the question for them."
                        },
                        {
                            "text": "In Part 2, your child will be asked to generate as many ideas as they can. If your child pauses for several seconds, please ask them: ''Is there anything else or are you all done?'' You can repeat this for every pause."
                        }
                    ]
                },
                {
                    "title": "Taking a break",
                    "listblocks": [
                        {
                            "text": "If your child gets fussy or distracted, or you need to attend to something for a moment, you can pause the study by pressing the space key on the keyboard."
                        },
                        {
                            "text": "If you need to end the study early, try closing the window and you should see an ‘exit' option pop up. You'll be prompted to note any technical problems you might be experiencing and to select a privacy level for your video."
                        }
                    ]
                },
                {
                    "title": "Test your audio",
                    "text": "Please turn the volume up so it's easy to hear but still comfortable.",
                    "mediaBlock": {
                        "text": "Make sure you and your child can hear the audio before you begin!",
                        "isVideo": false,
                        "sources": [
                            {
                                "src": "https://raw.githubusercontent.com/wongmich/productive-pretense-lookit/choose-then-generate/mp3/TestAudio.mp3",
                                "type": "audio/mp3"
                            }
                        ],
                        "mustPlay": true,
                        "warningText": "Please try playing the sample audio."
                    }
                }
            ],
            "showWebcam": false,
            "nextButtonText": "Next"
        },
        "video-quality-checklist": {
            "kind": "exp-video-config-quality",
            "title": "It's time to get your child and get in positions!",
            "introText": "We'll be analyzing what your child chooses and what they say -- but only if we can hear them clearly! Please check each of the following to ensure we're able to use your video:",
            "requireItemConfirmation": true,
            "completedItemText": "Did it!",
            "instructionBlocks": [
                {
                    "title": "Center your webcam if needed",
                    "text": "<strong>Make sure the webcam you're using is roughly centered</strong> relative to this monitor. This makes it much easier for us to see your video.",
                    "image": {
                        "src": "https://s3.amazonaws.com/lookitcontents/website/centering.png",
                        "alt": "Example images of using centered external webcam on monitor or built-in webcam on laptop."
                    }
                },
                {
                    "title": "Make sure you can clearly see your child's face",
                    "text": "Take a few moments to get settled and make sure your child's face is clearly visible in the webcam preview to the right. You may need to adjust the webcam angle or turn on a light to make sure their face is visible."
                },
                {
                    "title": "When you're ready",
                    "text": "The green button down below will start the game. Press the button once you and your child are ready to go!"
                }
            ],
            "requireTestVideo": false,
            "showRecordMenu": true
        },
        "webcam-display-break": {
            "kind": "exp-lookit-webcam-display",
            "blocks": [
                {
                    "title": "Let's take a quick break",
                    "text": "We're all done with the first half of the study! Before continuing,",
                    "listblocks": [
                        {
                            "text": "Please check that your child is still visible."
                        },
                        {
                            "text": "You can make some silly faces!"
                        }
                    ]
                }
            ],
            "nextButtonText": "Next",
            "showPreviousButton": false,
            "displayFullscreenOverride": true,
            "startRecordingAutomatically": false
        },
        // CHOOSE INTRO FRAMES
        "choose-gameintro": {
            "kind": "exp-lookit-video",
            "video": {
                "loop": false,
                "position": "fill",
                "source": "choose-gameintro"
            },
            "backgroundColor": "white",
            "autoProceed": false,
            "showPreviousButton": false,
            "requireVideoCount": 1,
            "doRecording": false,
            "frameOffsetAfterPause": 0,
            "baseDir": "https://raw.githubusercontent.com/wongmich/productive-pretense-lookit/choose-then-generate/",
            "videoTypes": ["mp4"]
        },
        "choose-warmup-letspractice": {
            "kind": "exp-lookit-images-audio",
            "baseDir": "https://raw.githubusercontent.com/wongmich/productive-pretense-lookit/choose-then-generate/",
            "audio": "choose_warmup_letspractice",
            "images": [
                {
                    "id": "warmup",
                    "src": "introgame.png",
                    "position": "fill",
                    "nonChoiceOption": true
                }
            ],
            "backgroundColor": "white",
            "autoProceed": true,
            "doRecording": false,
        },
        "choose-warmup-whichwould": {
            "kind": "exp-lookit-images-audio",
            "baseDir": "https://raw.githubusercontent.com/wongmich/productive-pretense-lookit/choose-then-generate/",
            "audio": "choose_warmup_letspractice",
            "images": [
                {
                    "id": "choose-warmupgamebg",
                    "src": "introgame.png",
                    "position": "fill",
                    "nonChoiceOption": true
                },
                {
                    "id": "squirrel",
                    "src": "introsquirrel.png",
                    "top": "54",
                    "left": "76",
                    "width": "24.3",
                    "displayDelayMs": 8200,
                    "correct": true,
                    "feedbackAudio": "choose_warmup_greatSQUIRRELintro"
                },
                {
                    "id": "bird",
                    "src": "introbird.png",
                    "top": "55.5",
                    "left": "0.1",
                    "width": "24.3",
                    "displayDelayMs": 9200,
                    "correct": true,
                    "feedbackAudio": "choose_warmup_greatBIRDintro"
                }
            ],
            "highlights": [
                {
                    "range": [8, 8.8],
                    "imageId": "squirrel"
                },
                {
                    "range": [9, 9.8],
                    "imageId": "bird"
                }
            ],
            "parentTextBlock": {
                "css": {
                    "font-size": "13pt",
                    "padding": "0.5em"
                },
                "title": "For Parents",
                "text": "Please just say 'Okay!' when your child answers - don't give any hints or say whether you agree! You can always click 'Replay' to repeat the question. \nIf your child can click on their own, let them click one of the answer choices, then click the Next button. If they can't click on their own, you can click for them."
            },
            "correctChoiceRequired": true,
            "showPreviousButton": false,
            "backgroundColor": "white",
            "autoProceed": false,
            "nextButtonText": "Next",
            "choiceRequired": true,
            "doRecording": true
        },
        // GENERATE INTRO FRAMES
        "generate-gameintro": {
            "kind": "exp-lookit-video",
            "video": {
                "loop": false,
                "position": "fill",
                "source": "generate-gameintro"
            },
            "baseDir": "https://raw.githubusercontent.com/wongmich/productive-pretense-lookit/choose-then-generate/",
            "videoTypes": ["mp4"],
            "backgroundColor": "white",
            "autoProceed": false,
            "showPreviousButton": false,
            "requireVideoCount": 1,
            "doRecording": true,
            "frameOffsetAfterPause": 0,
        },
        "generate-warmup-letspractice": {
            "kind": "exp-lookit-images-audio",
            "baseDir": "https://raw.githubusercontent.com/wongmich/productive-pretense-lookit/choose-then-generate/",
            "audio": "generate_warmup_letspractice",
            "audioTypes": ["mp3"],
            "images": [
                {
                    "id": "generate-meadow",
                    "src": "introgame.png",
                    "position": "fill",
                    "nonChoiceOption": true
                }
            ],
            "backgroundColor": "white",
            "autoProceed": true,
            "doRecording": true,
        },
        "generate-warmup-feedback": {
            "kind": "exp-lookit-images-audio",
            "baseDir": "https://raw.githubusercontent.com/wongmich/productive-pretense-lookit/choose-then-generate/",
            "audio": "generate_warmup_great",
            "audioTypes": ["mp3"],
            "images": [
                {
                    "id": "meadowslidefeedback",
                    "src": "introgame.png",
                    "position": "fill"
                }
            ],
            "backgroundColor": "white",
            "autoProceed": false,
            "showPreviousButton": false,
            "doRecording": true,
        },
        // END OF STUDY
        "end-video": {
            "kind": "exp-lookit-video",
            "videoTypes": ["mp4"],
            "baseDir": "https://raw.githubusercontent.com/wongmich/productive-pretense-lookit/choose-then-generate/",
            "video": {
                "loop": false,
                "position": "fill",
                "source": "ending"
            },
            "backgroundColor": "white",
            "autoProceed": false,
            "requireVideoCount": 1,
            "doRecording": false,
            "frameOffsetAfterPause": 0,
        },
        "exit-survey": {
            "kind": "exp-lookit-exit-survey",
            "debriefing": {
                "title": "Thank you for participating!",
                "blocks": [
                    {
                        "title": "",
                        "text": "This research wouldn't be possible without awesome parents like you."
                    },
                    {
                        "title": "Some Background Information:",
                        "text": "Play, including pretend play, is a common part of early childhood. However, researchers are still studying how play behaviors develop, and how play affects children's learning and development. Because play is so variable across individual children, it can be tricky to carefully measure and study how children think and make decisions during play.\n\nIn this research, we look at which objects children choose to play pretend with. Do children prefer objects that offer more possibilities for imagining with? Or do they prefer objects that they can very quickly imagine as something else, even if they can only think of one idea?\n\nTo answer these questions, we ran two related tasks in this study. Part 1 measured which objects children prefer. Part 2 measured what ideas children come up with. By combining the data from both tasks, we can better understand how children think about pretend possibilities, and how children choose what to play with. We are also interested in how children's pretend play relates to other aspects of their development, such as language and age."
                    },
                    {
                        "title": "Additional Resources:",
                        "text": "<ul>Below we list a few resources to learn more about pretend play and its role in development: <li>A playlist of <a href='https://www.ted.com/playlists/383/the_importance_of_play' target='_blank' rel='noopener'>TED Talks on the benefits of play</a>, for children and adults </li><li>Project Zero at the Harvard School of Education has published several resources for teachers and families about play and learning, including a blog with <a href='https://www.popatplay.org/categories/home-learning' target='_blank' rel=noopener'>family-friendly activities for playful home learning</a> and a <a href='https://pz.harvard.edu/sites/default/files/PoP%20Book%203.27.23.pdf' target='_blank' rel=noopener'>guidebook on the Pedagogy of Play</a> for educators .</li><li><a href='https://files.eric.ed.gov/fulltext/EJ1016165.pdf' target='_blank' rel='noopener'>This article </a> from the American Journal of Play discusses how imaginative play may foster causal reasoning by thinking about alternatives.</li></ul>"
                    },
                    {
                        "title": "Compensation:",
                        "text": "To thank you for your participation, we'll be emailing you a $5 USD Amazon gift card - this should arrive in your inbox within the next week after we confirm your consent video and check that your child is in the age range for this study (If you don't hear from us by then, feel free to reach out!). If you participate again with another child in the age range, you'll receive one gift card per child."
                    },
                    {
                        "title": "Questions or Concerns:",
                        "text": "Please do not hesitate to contact Michelle Wong at michellewong@fas.harvard.edu"
                    }
                ]
            }
        },
        // MOTIVATION
        "lets-keep-going": {
            "kind": "exp-lookit-video",
            "baseDir": "https://raw.githubusercontent.com/wongmich/productive-pretense-lookit/choose-then-generate/",
            "videoTypes": ["mp4"],
            "video": {
                "loop": false,
                "position": "fill",
                "source": "letskeepgoing"
            },
            "backgroundColor": "white",
            "autoProceed": false,
            "showPreviousButton": false,
            "requireVideoCount": 1,
            "doRecording": false,
            "frameOffsetAfterPause": 0
        },
        "halfway-done-choose": {
            "kind": "exp-lookit-video",
            "baseDir": "https://raw.githubusercontent.com/wongmich/productive-pretense-lookit/choose-then-generate/",
            "videoTypes": ["mp4"],
            "video": {
                "loop": false,
                "position": "fill",
                "source": "halfwaydone-choose"
            },
            "backgroundColor": "white",
            "autoProceed": false,
            "showPreviousButton": false,
            "requireVideoCount": 1,
            "doRecording": false,
            "frameOffsetAfterPause": 0
        },
        "halfway-done-generate": {
            "kind": "exp-lookit-video",
            "baseDir": "https://raw.githubusercontent.com/wongmich/productive-pretense-lookit/choose-then-generate/",
            "videoTypes": ["mp4"],
            "video": {
                "loop": false,
                "position": "fill",
                "source": "halfwaydone-generate"
            },
            "backgroundColor": "white",
            "autoProceed": false,
            "showPreviousButton": false,
            "requireVideoCount": 1,
            "doRecording": false,
            "frameOffsetAfterPause": 0
        }
    }

    // Start off the frame sequence with config/consent/introduction frames
    // so far, we have 7 initial frames
    // WHILE TESTING, SKIP INITIAL FRAMES by using an empty list []
    //frame_sequence = []
    frame_sequence = ['welcome', 'video-config', 'video-consent', 'study-preview', 'study-instructions', 'video-quality-checklist', 'choose-gameintro', 'choose-warmup-whichwould']

    // Now define parameters for test trials
    // each element is a size 7 list:
    // [ audio = choose-scene-objectL-objectR
    //   objectL_delay, objectR_delay
    //   objectL_hl1, objectR_hl1, objectL_hl2, objectR_hl2
    // ]
    // NOTE: audio should filenames in baseDir/mp3
    // NOTE: since audio filename includes all other object names, we can just use the audio filename to define the rest of the trial
    // to reduce chance of typos 
    var choose_pairings_a1 = [
        [
            "choose-campers-helmet-blanket",
            3300, 4600,
            [3.3, 4.3], [4.6, 5.6], [8.7, 9.7], [10, 11]
        ],
        [
            "choose-cooks-hairbrush-stringlights",
            3200, 4400,
            [3.2, 4.2], [4.4, 5.4], [8.4, 9.4], [9.6, 10.6]
        ],
        [
            "choose-doctors-socks-broom",
            3700, 5400,
            [3.7, 4.7], [5.4, 6.4], [9.8, 10.8], [11.4, 12.4]
        ],
        [
            "choose-explorers-icescoop-keys",
            3500, 4900,
            [3.5, 4.5], [4.9, 5.9], [9.4, 10.4], [10.8, 11.8]
        ],
        [
            "choose-fashionshow-vacuumtube-pokerchips",
            3800, 5400,
            [3.8, 4.8], [5.4, 6.4], [10.2, 11.2], [11.7, 12.7]
        ],
        [
            "choose-magicians-sponge-featherduster",
            3200, 4500,
            [3.2, 4.2], [4.5, 5.5], [8.6, 9.6], [9.8, 10.8]
        ],
        [
            "choose-pirates-papertoweltube-frisbee",
            3700, 5500,
            [3.7, 4.7], [5.5, 6.5], [9.7, 10.7], [11.7, 12.7]
        ],
        [
            "choose-shoppers-hanger-yellowball",
            3100, 4800,
            [3.1, 4.1], [4.8, 5.8], [9.4, 10.4], [11, 12]
        ]]
    var choose_pairings_a2 = [
        [
            "choose-astronauts-blanket-helmet",
            3500, 4500,
            [3.5, 4.5], [4.5, 5.5], [8.7, 9.5], [9.7, 10.5]
        ],
        [
            "choose-construction-featherduster-sponge",
            3700, 5200,
            [3.7, 4.7], [5.2, 6.2], [9.8, 10.8], [11.2, 12.2]
        ],
        [
            "choose-cowboys-stringlights-hairbrush",
            3300, 4700,
            [3.3, 4.3], [4.7, 5.7], [9, 10], [10.3, 11.3]
        ],
        [
            "choose-firefighters-pokerchips-vacuumtube",
            3500, 5100,
            [3.5, 4.5], [5.1, 6.1], [9.7, 10.7], [11, 12]
        ],
        [
            "choose-knights-yellowball-hanger",
            3400, 4900,
            [3.4, 4.4], [4.9, 5.9], [9.2, 10.2], [10.7, 11.7]
        ],
        [
            "choose-musicians-broom-socks",
            3700, 5000,
            [3.7, 4.7], [5, 6], [9.6, 10.6], [10.8, 11.8]
        ],
        [
            "choose-teaparty-frisbee-papertoweltube",
            3700, 4900,
            [3.7, 4.7], [4.9, 5.9], [10.2, 11.2], [11.4, 12.4]
        ],
        [
            "choose-trains-keys-icescoop",
            4400, 5700,
            [4.4, 5.4], [5.7, 6.7], [10.5, 11.5], [11.7, 12.7]
        ]]
    var choose_pairings_b1 = [
        [
            "choose-astronauts-helmet-blanket",
            3600, 5000,
            [3.6, 4.6], [5, 6], [9.7, 10.4], [10.7, 11.4]
        ],
        [
            "choose-cowboys-hairbrush-stringlights",
            3500, 4800,
            [3.5, 4.5], [4.8, 5.8], [9.2, 10.2], [10.3, 11.3]
        ],
        [
            "choose-construction-sponge-featherduster",
            3600, 4800,
            [3.6, 4.6], [4.8, 5.8], [9.8, 10.8], [10.8, 11.8]
        ],
        [
            "choose-firefighters-vacuumtube-pokerchips",
            3600, 5100,
            [3.6, 4.6], [5.1, 6.1], [9.7, 10.7], [11.1, 12.1]
        ],
        [
            "choose-musicians-socks-broom",
            3600, 5000,
            [3.6, 4.6], [5, 6], [8.9, 9.9], [10.4, 11.4]
        ],
        [
            "choose-knights-hanger-yellowball",
            3300, 5000,
            [3.3, 4.3], [5, 6], [9.3, 10.3], [11, 12]
        ],
        [
            "choose-trains-icescoop-keys",
            3700, 5200,
            [3.7, 4.7], [5.2, 6.2], [9.7, 10.7], [11.1, 12.1]
        ],
        [
            "choose-teaparty-papertoweltube-frisbee",
            4200, 6100,
            [4.2, 5.2], [6.1, 7.1], [10.8, 11.8], [12.5, 13.5]
        ]]
    var choose_pairings_b2 = [
        [
            "choose-campers-blanket-helmet",
            3400, 4800,
            [3.4, 4.4], [4.8, 5.8], [8.8, 9.8], [10, 11]
        ],
        [
            "choose-cooks-stringlights-hairbrush",
            11000, 12000,
            [11, 12], [12, 13], [16, 17], [18, 18.9]
        ],
        [
            "choose-doctors-broom-socks",
            3500, 4800,
            [3.5, 4.5], [4.8, 5.8], [9.1, 10.1], [10.2, 11.2]
        ],
        [
            "choose-explorers-keys-icescoop",
            3600, 5000,
            [3.6, 4.6], [5, 6], [9.5, 10.5], [10.7, 11.7]
        ],
        [
            "choose-fashionshow-pokerchips-vacuumtube",
            4000, 5500,
            [4, 5], [5.5, 6.5], [10.4, 11.4], [11.7, 12.7]
        ],
        [
            "choose-magicians-featherduster-sponge",
            3800, 5300,
            [3.8, 4.8], [5.3, 6.3], [9.6, 10.6], [11, 12]
        ],
        [
            "choose-pirates-frisbee-papertoweltube",
            3300, 4400,
            [3.3, 4.3], [4.4, 5.4], [9.5, 10.5], [10.6, 11.6]
        ],
        [
            "choose-shoppers-yellowball-hanger",
            3300, 4900,
            [3.3, 4.3], [4.9, 5.9], [9.3, 10.3], [10.8, 11.8]
        ]]

    // Now implement counterbalancing logic and define ordered trial sequence
    const counterbalance_group = randomItem(['a1', 'a2', 'b1', 'b2'])
    var ordered_choose_pairings = [] // This will be the sequenced list of 8 choose trials
    switch (counterbalance_group) {
        case 'a1':
            ordered_choose_pairings = shuffle(choose_pairings_a1);
            break;
        case 'a2':
            ordered_choose_pairings = shuffle(choose_pairings_a2);
            break;
        case 'b1':
            ordered_choose_pairings = shuffle(choose_pairings_b1);
            break;
        case 'b2':
            ordered_choose_pairings = shuffle(choose_pairings_b2);
            break;
    }

    // As we generate the choose frames, also fill in the scene-object pairs to use in generate
    var generate_stimuli_L = []
    var generate_stimuli_R = []

    // Create list of 8 choose frames
    for (iTrial = 0; iTrial < 8; iTrial++) {
        // First, extract frame parameters from the trial pairing definition
        // var [audio, delayL, delayR, highlightL1, highlightR1, highlightL2, highlightR2] = ordered_choose_pairings[iTrial]
        // var [condition, scene, objectL, objectR] = audio.split('-') // ['choose', 'cowboys', 'brush', 'stringlights']
        var audio = ordered_choose_pairings[iTrial][0]
        var delayL = ordered_choose_pairings[iTrial][1]
        var delayR = ordered_choose_pairings[iTrial][2]
        var highlightL1 = ordered_choose_pairings[iTrial][3]
        var highlightR1 = ordered_choose_pairings[iTrial][4]
        var highlightL2 = ordered_choose_pairings[iTrial][5]
        var highlightR2 = ordered_choose_pairings[iTrial][6]
        var scene = audio.split('-')[1]
        var objectL = audio.split('-')[2]
        var objectR = audio.split('-')[3]

        // Also store scene-object pairs for generate trials
        generate_stimuli_L.push([scene, objectL]) // first 8 pairings
        generate_stimuli_R.push([scene, objectR]) // second 8 pairings

        // Then define frame parameters
        scene_png = 'scene-' + scene + '.png' // magicians.png
        objectL_png = objectL + '.png' // socks.png
        objectR_png = objectR + '.png' // socks.png

        // Now use parameters to create this trial frame
        thisTrial = {
            "kind": "exp-lookit-images-audio",
            "baseDir": "https://raw.githubusercontent.com/wongmich/productive-pretense-lookit/choose-then-generate/",
            "audio": audio, // take from list
            "images": [ // take from list: scene, objectL, objectR
                {
                    "id": scene,  //"magicians"
                    "src": scene_png, //"scene-magicians.png",
                    "position": "fill",
                    "nonChoiceOption": true
                },
                {
                    "id": objectL + "_left", //"socks",
                    "src": objectL_png,//"socks.png",
                    "top": "55.5",
                    "left": "0.1",
                    "width": "24.3",
                    "displayDelayMs": delayL//11000
                },
                {
                    "id": objectR + "_right",//"rightbroom",
                    "src": objectR_png,//"broom.png",
                    "top": "55.5",
                    "left": "76",
                    "width": "24.3",
                    "displayDelayMs": delayR//12000
                }
            ],
            "highlights": [ // take from list
                {
                    "range": highlightL1,//[11, 12],
                    "imageId": objectL + "_left"// "socks"
                },
                {
                    "range": highlightR1,//[12, 13],
                    "imageId": objectR + "_right"//"broom"
                },
                {
                    "range": highlightL2,//[17, 18],
                    "imageId": objectL + "_left"//"socks"
                },
                {
                    "range": highlightR2,//[18, 19],
                    "imageId": objectR + "_right"//"broom"
                }
            ],
            "parentTextBlock": { // always the same
                "css": {
                    "font-size": "13pt",
                    "padding": "0.5em"
                },
                "title": "For Parents (Picture " + (iTrial + 1) + " of 8)",
                "text": "Please just say 'Okay!' when your child answers - don't give any hints or say whether you agree! You can always click 'Replay' to repeat the question. \nIf your child can click on their own, let them click one of the answer choices, then click the Next button. If they can't click on their own, you can click for them."
            },
            "autoProceed": false,
            "maximizeDisplay": true,
            "pageColor": "white",
            "backgroundColor": "white",
            "choiceRequired": true,
            "showPreviousButton": false,
            "doRecording": true,
            "pauseWhenExitingFullscreen": true
        }

        // Store this trial in frame definitions and frame sequence
        frameId = 'choose-trial-' + (iTrial + 1) // remember iTrial is zero-indexed
        frames[frameId] = thisTrial;
        frame_sequence.push(frameId);

        // Add motivation videos.
        // halfway done!
        if (iTrial == 3) {
            frame_sequence.push('halfway-done-choose')
        }
    }

    frame_sequence.push('webcam-display-break')
    frame_sequence.push('generate-gameintro')

    // // Now define parameters for generate trials
    // // Each scene appears once in the first 8 trials and once in second 8 trials
    if (randomBoolean()) { // randomize if L objects go first or last 8 trials
        ordered_gen_pairings = shuffle(generate_stimuli_L).concat(shuffle(generate_stimuli_R))
    } else {
        ordered_gen_pairings = shuffle(generate_stimuli_R).concat(shuffle(generate_stimuli_L))
    }
    // // Check if scenes are repeated on trial 8 & 9
    if (ordered_gen_pairings[7][0] == ordered_gen_pairings[8][0]) {
        // If yes, remove trial 9 and place at end of the trial list
        ordered_gen_pairings.push(ordered_gen_pairings.splice(8, 1))
    }

    // // Create list of 16 generate frames
    for (iTrial = 0; iTrial < 16; iTrial++) {
        //[scene, object] = ordered_gen_pairings[iTrial]
        var scene = ordered_gen_pairings[iTrial][0]
        var object = ordered_gen_pairings[iTrial][1]
        // Then define frame parameters
        scene_png = 'scene-' + scene + '.png' // magicians.png
        object_png = object + '.png' // socks.png

        // Define single generate trial
        thisGenerateTrial = {
            "kind": "exp-lookit-images-audio",
            "baseDir": "https://raw.githubusercontent.com/wongmich/productive-pretense-lookit/choose-then-generate/",
            "audio": 'generate-' + scene + '-' + object, // take from list
            "images": [
                {
                    "id": scene,  //"magicians"
                    "src": scene_png, //"scene-magicians.png",
                    "width": 80,
                    "left": 0,
                    "top": 15
                },
                {
                    "id": object, //
                    "src": object_png, //
                    "position": "right",
                    "displayDelayMs": 5000
                }],
            "parentTextBlock": {
                "css": {
                    "font-size": "13pt",
                    "padding": "0.5em"
                },
                "title": "For Parents (Picture " + (iTrial + 1) + " of 16)",
                "text": "Please just say 'Okay!' when your child answers - don't give any hints or say whether you agree!\nIf your child pauses for more than a few seconds, please ask them: ''Is there anything else or are you all done?'' You can repeat this for every pause."
            },

            "audioTypes": ["mp3"],
            "autoProceed": false,
            "doRecording": true,
            "choiceRequired": false,
            "showPreviousButton": false,
            "backgroundColor": "white",
            "allowUserPause": false,
            "waitForRecordingMessageColor": "black"

        }
        // Store this trial in frame definitions and frame sequence
        frameId = 'generate-trial-' + (iTrial + 1) // remember iTrial is zero-indexed
        frames[frameId] = thisGenerateTrial;
        frame_sequence.push(frameId);

        // Add motivation videos.
        // halfway done!
        if (iTrial == 7) {
            frame_sequence.push('halfway-done-generate')
        }
        // "you're doing great!" 
        if (iTrial == 3 || iTrial == 11) {
            frame_sequence.push('lets-keep-going')
        }
    }

    // // Finish up the frame sequence with the end video and exit survey
    frame_sequence = frame_sequence.concat(['end-video', 'exit-survey'])

    // Return a study protocol with "frames" and "sequence" fields just like when
    // defining the protocol in JSON only
    return {
        frames: frames,
        sequence: frame_sequence
    }
}

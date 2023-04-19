# productive-pretense/experiments

This folder contains code (e.g., Lookit protocol) for behavioral experiments.

## Experiment 1:

< describe files when they are ready >
This is a Lookit study for children. We have two tasks (run with independent participants): 

- Choice task (2AFC): Given this pretend scenario, which of these 2 objects would you rather play with?
- Production task (free response): Given this object and pretend scenario, what could you pretend this object to be? List all the ideas you can think of.

We designed 8 stimuli sets, each consisting of 2 scenarios (A/B) and 2 objects (object 1/2). Participants in both conditions will complete 8 trials, one trial from each stimuli set, in random order.

On the choice task, for each trial we randomly assign which scenario participants get. We predict that object preference will vary by scenario. Specifically, we predict 
${P(object1 | sceneA)} > {P(object1 | sceneB)}$

On the production task, for each trial we randomly assign which scenario and which object participant sees (i.e., they get one of 4 potential combinations). We predict that participants will generate more ideas for objects that are more consistent with the scenario. Specifically, we predict 
$(ideas_{1A} / ideas_{2A}) > (ideas_{1B} / ideas_{2B})$

Moreover, we predict that the relative 'productivity' of an object-scenario pair will correlate with the relative object preference on the choice task. Thus, this correlation != 0

```math
{{P(object1 | sceneA)}\over{P(object1 | sceneB)}} \sim {{(ideas_{1A} / ideas_{2A})}\over{(ideas_{1B} / ideas_{2B})}}
```

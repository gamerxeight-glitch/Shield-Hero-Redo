
Prompting vs Workflow

Before we start talking about writing prompts, we need to separate two concepts that people constantly mix together: prompts and workflows.

Most of the time you'll hear someone say, "Here's my prompt," and then they'll show you a huge wall of text. But if you actually read it, you'll notice it's doing several different jobs at once. Some parts define behavior, while others tell the AI exactly how to process information.

A prompt tells the model what kind of behavior or output you want.

A workflow tells the model how to reach that output.

Think of it this way.

If I tell someone:

"Write an emotional conversation between two rivals."

That's a prompt. I'm describing the goal, but I'm leaving the process entirely up to the model.

Now imagine I say:

First analyze their relationship, determine their emotional state, identify their immediate goals, decide who has the conversational advantage, then write the interaction while keeping those factors consistent.

That's a workflow. Instead of only describing the destination, I'm also describing the path.

Neither approach is inherently better. In fact, most good roleplay prompts use both. The prompt defines the desired behavior, while the workflow helps the AI consistently arrive at that behavior.

Here's a very simple comparison.

Prompt style

Write immersive roleplay with believable characters, emotional dialogue, and a living world where actions have meaningful consequences.

Around 20 tokens of instruction, yet it clearly communicates the desired result.

Workflow style

Analyze the current scene, determine each character's motivations and emotional state, decide how those influence their priorities, plan the scene progression, then generate the response while maintaining continuity and leaving room for the user's next action.

Notice how this barely describes the desired writing style. Instead, it describes the reasoning process that should happen before the response is generated.

Throughout this guide we'll mostly focus on a mix of both, but and you'll come to notice that many of my own prompts also contain both elements. Understanding the difference between the two is one and when to use each one are part of the biggest steps toward writing better prompts.

Roleplay isn't difficult because generating text is difficult. It's difficult because selecting which information matters is difficult. A workflow doesn't magically make the model smarter—it helps organize and prioritize the massive amount of context before generation begins. 

So why does workflow matter so much for roleplay?

Because roleplay is one of the most context-heavy tasks you can ask an LLM to perform.

At any given moment, the model may have access to a character card, a scenario, a lorebook, previous messages, author's notes, system prompts, jailbreaks, and additional modules. That's thousands upon thousands of tokens, all potentially competing for attention.

The model doesn't magically know what's important. It has to decide that while generating a response.

Some newer models are surprisingly good at filtering relevant information on their own. Others are less efficient and may focus on details that barely matter while ignoring the ones that actually shape the scene. But even for the strongest models, giving them a good workflow improves consistency.

Think of it like asking someone to write a report after dumping ten books on their desk.

You could simply say:

"Write the report."

Or you could say:

"First identify the important information, separate it by topic, determine which facts are relevant to the question being asked, then write the report."

The second person isn't necessarily smarter. They were simply given a process.

That's exactly what a workflow does.

Instead of telling the model only what the final response should look like, you're helping it organize the massive amount of information it's receiving before it starts writing.

This is why many of my prompts contain steps like analyzing the world state, determining emotional pressures, evaluating relationship dynamics, planning scene progression, and only then generating the response. Those aren't there to make the prompt look complicated. They're there to help the model filter and prioritize context.

In my opinion, one of the biggest improvements you can make to a roleplay prompt isn't adding more rules. It's teaching the model how to decide which rules matter in the current scene.
The biggest misconception about prompting

In my opinion, the biggest misconception people have about prompting is thinking that describing the result is the same as telling the AI how to achieve it.

You'll see prompts that say things like:

You are an award-winning novelist. Write immersive, cinematic, emotionally rich prose with realistic dialogue.

Now, does the AI understand what those words mean? Absolutely.

But here's the problem: those are descriptions, not guidelines.

What exactly makes an award-winning novelist?

Is it longer descriptions? Better pacing? More dialogue? Richer vocabulary? More metaphors? Less exposition? More internal thoughts?

The prompt never says. So the model has to fill in those gaps by itself. It will use its own interpretation, and that interpretation may vary between responses or even between different models.

Instead, imagine something like this:

Write an endless story focusing on character development and human relationships
- Prioritize dialogue over narration.
- Expand moments of tension and compress routine actions.
- Emotional weight should emerge through behavior rather than exposition.
- Describe the environment only when it reinforces atmosphere or action.
- Avoid repeating information already established.

Notice the difference?

The second example doesn't tell the AI to be a great writer. It tells the AI how to write.

This is actually the philosophy behind almost every part of my own prompts. I rarely use labels like "immersive," "realistic," or "high quality." Instead, I try to break those concepts into behaviors and decision-making rules.

I don't tell the AI that characters should feel realistic. I tell it that they should interpret events through their personality, emotional state, relationship dynamics, biases, and limited information.

I don't tell the AI to create an immersive world. I tell it that events continue off-screen, consequences accumulate, and information spreads imperfectly.

The immersion is the result of those mechanisms, not the instruction itself.

One thing you'll probably notice throughout this guide is that I prefer replacing adjectives with processes. Rather than telling the model what the final product should look like, I try to explain the behaviors that naturally produce that result.

So whenever you're writing a prompt and you find yourself using words like "immersive," "realistic," "cinematic," or "award-winning," stop for a second and ask yourself:

Can I replace this adjective with actual instructions?

Most of the time, the answer is yes. And in my experience, that's where prompts start becoming much more consistent.
Why your prompt needs a core narrative structure

Now that we've talked about prompts and workflows, let's talk about what I consider the backbone of every good roleplay prompt: its core narrative structure.

When people start writing prompts, they usually begin adding ideas.

    Make dialogue realistic.

    Don't control the user.

    Make characters immersive.

    The world should feel alive.

    Create interesting NPCs.

    Progress the story.

None of these are bad instructions. In fact, they're all good goals.

The problem is that they don't tell the model how to build a response.

Remember, roleplay is an extremely context-heavy task. The model has access to the character card, scenario, lorebook, previous messages, system prompts, author's notes, and everything else you've given it. Before writing a single sentence, it has to decide what information matters, how to interpret it, and how to transform it into a coherent narrative.

That's exactly what the core narrative structure should define.

Its job is not to add details to the story. Its job is to define the process that creates the story.

A good core narrative structure explains:

    What information the model should look at.

    How it should prioritize that information.

    How characters should interpret it.

    How the scene should be planned.

    How the response should be constructed.

    How the narrative should progress.

In other words, it tells the model how to generate every response from beginning to end.

At this point you might think:

"If that's the case, shouldn't the core structure contain every single detail?"

My answer would be no.

The core structure should contain only the process that should happen every single response. Details that apply only to specific aspects of the roleplay can and should be externalized into modules.

For example, your core structure may define that the model should analyze character motivations before writing. But how relationships evolve, how dialogue is handled, how movement is described, or how intimacy is written can all live in their own specialized modules.

This separation has a huge advantage.

The backbone remains stable, while individual behaviors can be modified, improved, or replaced without rewriting the entire prompt.

Think of it like a factory.

The core narrative structure is the assembly line. Every response passes through it, following the same process from input to output.

The modules are specialized stations attached to that assembly line. One handles dialogue, another handles relationships, another handles world continuity, another handles movement. They improve specific parts of the product, but they don't replace the assembly line itself.

That's why my prompts are a mix of prompting and workflow. The workflow provides the response-generation process that every reply follows, while the prompting modules define how specific aspects of that response should behave.

People often call this entire format a workflow because it resembles a sequence of instructions. I don't disagree with that. But the important idea is understanding its purpose: it isn't there to make the prompt look more sophisticated. It's there to give the model a consistent decision-making process so that the quality of the roleplay remains stable from one response to the next.
How I structure prompts into modules

Now that we have our assembly line, it's time to add the workers.

And yes, I'm continuing with the factory analogy, and there is nothing you can do to stop me :D

A common mistake I see is people trying to put every single instruction inside the main workflow. The result is usually a gigantic wall of text where every response is expected to think about everything at once.

In my opinion, that's not what the core narrative structure should do.

The core narrative structure exists to define the response-generation process. It tells the model what information to gather, how to prioritize it, how to process it, and how to build a coherent response from it. It is the assembly line that every response goes through.

But once the narrative reaches a certain stage, it still needs shape.

That's where modules come in.

I think many people misunderstand modules. They aren't just random sections added to make the prompt bigger, nor are they there to replace the main workflow. They exist to specialize specific aspects of the output.

The core narrative teaches the model how to generate a response.

The modules teach the model how particular parts of that response should look.

For example, imagine the core workflow reaches a point where dialogue needs to be written. The workflow already determined the context, the characters involved, their emotional state, and the scene progression.

Now the Dialogue Module steps in and says:

"This is how dialogue should be processed."

The same happens for relationships. The workflow already knows two characters are interacting, but the Relationship Module defines how trust, attraction, tension, familiarity, and boundaries should influence that interaction.

The same happens for knowledge. The workflow knows a character must react, but the Knowledge Module defines what information that character can reasonably possess and how they should interpret it.

The same happens for naming. The workflow knows a new character has appeared, but the Naming Module defines how names should be created and what principles they should follow.

Notice the pattern.

The module isn't replacing the workflow. It's refining one specific component of the final output.

This also explains why many things should be modules instead of part of the core narrative structure.

Naming isn't needed in every response.

Fight choreography isn't needed in every response.

Relationship progression isn't needed in every response.

NSFW isn't needed in every response.

Knowledge handling may only become important in certain situations.

These systems are specialized. The assembly line should call them when relevant, not carry all of their detailed logic as the centerpiece of every response.

Separating responsibilities also makes the prompt much easier to maintain. If I want to improve how fights are written, I edit the Fight Module. If I want to change relationship dynamics, I edit the Relationship Module. The backbone of the prompt remains untouched because its job isn't to define those details—it only defines the process that produces the narrative.

That's probably the best way I can summarize my prompting philosophy:

The core narrative structure provides consistency.

The modules provide specialization.

Together, they create a response that follows the same generation process every time while still giving each individual aspect of the roleplay its own identity and level of detail.
Writing good instructions

"Writing good instructions"...

Sounds easy, right?

Well... it's not that hard either. But you first need to understand what you're actually trying to accomplish.

So from here onward, it's time to get our hands dirty and look into coding...

I mean prompting.

So, what makes an instruction "good"?

That's actually a complicated question, but if I had to summarize it, I'd say this:

A good instruction is as short as possible while still allowing the model to correctly interpret what you want. It should be detailed enough that the desired output is clear, but not so restrictive that there's only one possible output.

Easy, right?

...Hell no.

This is one of those things that's much easier to show with examples than to explain with theory.

And this is also where prompting and workflows start working together.

Notice that I said working together, not being mixed everywhere. That's an important distinction.

Let's look at a piece of my own prompt:

3. AUTHORIAL ROLE & PROSE STANDARD
Write in the style of high-quality literary fiction and strong narrative light novels.

Prioritize:
- Immersion and clarity
- Emotional weight through behavior and dialogue
- Concise but rich description

Avoid:
- Filler
- Repetition
- Decorative or excessive prose

As you can see, I'm mostly prompting the desired outcome while giving some guidance about how to achieve it.

Could I have written ten paragraphs explaining exactly what I meant?

Sure.

Should I?

Probably not.

Remember what we talked about earlier: prompting is excellent at defining the destination.

Then why use a list instead of a normal paragraph?

Because models generally follow structured lists much more consistently than long explanations. Each bullet becomes an independent objective that's easy to identify and reinforce during generation.

So that's the prompting part.

Where's the workflow?

Well...

This is where things start becoming a little more interesting.

Step 1: Simulation
- Assess world state, tensions, off-screen activity, emotional state, psychological pressures, relationship dynamics, and active personal motives
- Determine impact on {{char}} priorities and behavior
- Decide NPC involvement
Step 2: Narrative Planning
- Control pacing: expand tension, compress routine
- Select optional narrative motion based on current state (character condition, active tensions, world context, and scene momentum). Selection must be causally justified, not arbitrary, and must remain consistent with character personality and behavior.
- Continuation
  - Development
  - Escalation
  - Complication
  - Displacement
  - Revelation

Notice the difference?

This isn't trying to sound beautiful.

It's trying to sound useful.

The workflow section is purely instructional. It's concise, direct, and blunt. It tells the model:

Take X.

Do Y.

Move to Z.

There's no room for fancy prose here. You're not writing a novel anymore. You're writing operating instructions.

You can think of workflows as cooking recipes.

First it was a factory and now it's cooking?

YES.

AND YOU'RE ALL LEAVING THIS GUIDE KNOWING HOW TO FOLLOW A RECIPE, SO TAKE NOTES :D

A recipe doesn't say:

"Become a world-class chef and make something delicious."

It says:

    Mix these ingredients.

    Heat this for five minutes.

    Stir continuously.

    Add salt at the end.

It's procedural.

That's exactly what workflows should be.

So what actually makes an instruction a good instruction?

In my opinion, it's knowing which tool you're supposed to use.

Sometimes you need a prompt.

Sometimes you need an instruction.

Sometimes you need an explanation.

And these three should support each other instead of competing.

If I had to give a very general rule, it would be:

    Instructions: Use these for information processing and handling. They're procedural. They tell the model what to do.

    Explanations: You can think of these as a subtype of instructions. In general, try to avoid them because they're verbose, but use them whenever you need to clarify an edge case or explain the reasoning behind a rule.

    Simple goals (prompts): These define the desired outcome. I almost always like placing one before a workflow so the model understands the objective before receiving the procedure. It's also a good idea to reinforce that objective after the workflow if necessary.

"But you never showed an actual detailed explanation."

Exactly.

Because if I had shown one before explaining the difference between these tools, you'd probably start defaulting to explanations for everything.

Now that you understand the distinction, here's an example:

If a scene no longer contains meaningful tension, interaction, uncertainty, or narrative momentum, transition, advance, or conclude it naturally instead of sustaining stagnant interaction loops.

Notice how this isn't simply telling the model what to do.

It's explaining when the rule applies, why it exists, and what problem it's trying to solve.

And that's the key takeaway from this section.

Writing good prompts isn't about always using prompts.

Or always using workflows.

Or always using explanations.

It's about knowing which one you're writing at any given moment and using the right tool for the job.
Positive vs Negative Prompting

Now let's talk about something that I think almost everyone gets wrong at first: negative prompting.

And no, I'm not saying negative prompting is bad.

I'm saying that negative prompting without telling the model what to do instead is usually bad.

Think about it.

If I tell the model:

Don't repeat yourself.

Okay...

Then what?

Should it shorten descriptions?

Should it introduce a new event?

Should it use dialogue instead?

Should it progress the scene?

The instruction removed one possibility, but it never provided an alternative. The model still has to figure that out by itself.

Let's make another example.

Imagine I tell you:

Don't get lost.

Great.

I still haven't told you where we're going.

Now compare that to this:

Go to the train station.

Follow the main avenue.

Turn left at the bridge.

Avoid the construction area.

The "avoid" instruction suddenly makes sense because it supports an already established process instead of trying to replace one.

And that's exactly how I think negative prompting should be used.

Let's take a roleplay example.

This isn't very useful:

Don't repeat previous descriptions.

But this is:

Progress the scene by introducing new information, advancing existing tensions, or developing character interaction.
Avoid:
- Repeating previously established descriptions.
- Restating information already known.
Now the model has somewhere to go.

The negative prompting isn't carrying the instruction anymore. It's protecting it.

This is actually a pattern you'll notice throughout my prompts.

First I establish a goal.

Then I explain the process.

Then I add safeguards.

Something like:

Goal
↓
Process
↓
Avoid

Instead of:
Don't do X.
Don't do Y.
Don't do Z.
Don't do A.
Don't do B.

Because eventually your prompt becomes nothing more than a giant list of things the model shouldn't do, while never explaining what it actually should do.

That's why I rarely use negative prompting by itself.

If I tell the model:

Don't make characters fall in love too quickly.

I'm still leaving a huge amount of interpretation to the model.

Instead, I'd rather tell it something like:

Relationship changes should feel incremental, reactive, and influenced by accumulated experiences.

Now the desired behavior is already defined.

Then, if I still think it's necessary, I can reinforce it with a safeguard such as:

Avoid sudden or unjustified emotional reversals.

Notice the difference.

The positive prompting creates the behavior.

The negative prompting protects it.

So if I could leave you with one simple rule for this chapter, it would be this:

Whenever you write a negative instruction, ask yourself:

"If the model successfully avoids this, does it actually know what it should do instead?"

If the answer is no, then the instruction is incomplete.

Negative prompting should rarely define behavior.

It should reinforce a behavior that has already been established through prompting and workflow.
Activation Conditions and Priorities

Now we're getting into one of those things that looks tiny but can completely change how your prompt behaves: activation conditions.

Most people spend hours writing modules, polishing instructions, optimizing workflows...

...and then forget to tell the model when any of those instructions should actually apply.

Imagine having your NSFW module active all the time.

I know you people.

I know you like your heart emojis, your dramatic moans, and your descriptive scenes.

Now imagine you forgot to add an activation condition and all of that starts leaking into the entire story.

A character trips over a rock.

"Ah♥"

Another one gets punched in the face.

"Ngh~♥"

Someone burns their hand while cooking.

"Haaah♥♥"

...

That's not what you wanted, is it?

...

Well...

Maybe for some of you it is. Who am I to judge? :D

The point is that without activation conditions, the model has no clear indication of when a set of instructions becomes relevant. So it may start applying them far more often than intended simply because they're part of the prompt.

And this doesn't only happen with NSFW.

Imagine your Fight Module being active during a casual conversation. Suddenly every handshake comes with body positioning, momentum, center of gravity, and follow-through.

Imagine your Naming Module constantly thinking about phonetics and cultural influences even though no new character has appeared.

Imagine your Relationship Module analyzing trust, attraction, resentment, and emotional progression every time two strangers ask each other what time it is.

Sounds ridiculous, but prompts like this are surprisingly common.

That's why activation conditions exist.

Their job is simply to tell the model:

"Only think about this when it's relevant."

You'll notice my prompt is full of little sentences like these:

    If a scene no longer contains meaningful tension...

    If the header is missing, malformed, or temporally inconsistent...

    Apply when characters can meaningfully interact.

    When multiple characters are present...

    Apply when movement, physical interaction, proximity, or scene intensity makes body motion or contact relevant. Otherwise, keep physical description minimal.

They're tiny instructions.

But they're doing a massive amount of work.

Instead of having every module screaming for attention every response, activation conditions act like a manager deciding which department actually needs to work today.

This naturally brings us to priorities.

Even when multiple modules are active, not all of them deserve the same amount of attention.

A sword fight should prioritize movement.

A heartfelt confession should prioritize dialogue and relationship dynamics.

A mystery should prioritize knowledge and perception.

A new character introduction should prioritize naming and characterization.

The model shouldn't treat every instruction as equally important all the time. It should determine which ones matter most in the current scene.

Think of it like a meeting.

If thirty people are talking at the same time, nobody gets anything done.

If only the people relevant to today's problem speak up, the meeting is much more productive.

Your prompt should work the same way.

So if there's one lesson I'd like you to take from this chapter, it's this:

Don't just tell the model what to do.

Tell it when to do it.

You'd be surprised how many prompts I've come across that had great ideas but no activation conditions, causing those ideas to bleed into the entire narrative in ways the author never intended.
Preventing Common Roleplay Failures

Congratulations.

You wrote your prompt.

You tested it.

And the AI did something incredibly stupid.

Welcome to prompt engineering :D

When people first start writing prompts, the solution to every problem seems obvious:

Just add another instruction.

The AI repeated itself?

Tell it not to repeat.

The AI controlled the user?

Tell it not to control the user.

The AI rushed the relationship?

Tell it not to rush relationships.

And honestly... at the beginning, this actually works surprisingly well. New prompts are usually under-specified, so adding instructions genuinely improves them.

But after some experience, something funny starts happening.

You realize that making your prompt longer doesn't necessarily make it better.

Adding more explanations doesn't necessarily make the model understand your intentions.

And even worse...

You fix one problem and accidentally create another.

You simplify a section because it looks redundant.

Then, twenty messages later, something completely unrelated starts breaking.

You read your prompt and think:

"This sentence isn't really doing anything."

So you delete it.

Two days later you're wondering why your NPCs suddenly became passive or why conversations keep looping.

Coincidence?

Maybe.

It probably wasn't :D

This happens because prompts stop being a collection of independent instructions and start becoming a system.

One instruction may exist because it directly solves a problem.

Another may exist to reinforce a process happening somewhere else.

And that's an important distinction.

People often confuse redundancy with reinforcement.

They're not the same thing.

Bad redundancy looks like this:

- Don't repeat.
- Don't repeat yourself.
- Avoid repetition.
- Never restate previous information.

That's four instructions trying to accomplish one job.

Good reinforcement looks more like this:

Goal:
Maintain narrative momentum.
↓
Workflow:
Advance active tensions.
↓
Module:
Dialogue evolves instead of looping.
↓
Safeguard:
Avoid stagnant interaction loops.

At first glance, someone might say:
  "But they're all talking about the same thing."

Exactly.

They're reinforcing the same concept from different perspectives.

The goal defines the destination.

The workflow defines the process.

The module specializes one aspect of that process.

The safeguard prevents common failures.

They're not duplicates. They're supporting the same mechanism.

That's actually something you'll notice throughout my prompt.

Sometimes an idea appears multiple times.

Not because I think the model forgot it.

But because each occurrence influences a different stage of the response-generation process.

If I remove one of them, the others may still work, but the overall behavior becomes less consistent.

This is also why simplifying prompts is much harder than expanding them.

Anyone can add another paragraph.

Making a prompt shorter while preserving exactly the same behavior is incredibly difficult.

Because before deleting something, you need to understand why it's there.

Maybe it's useless.

Maybe it's outdated.

Or maybe it's quietly holding together three different systems and you'll only realize it after spending an entire evening wondering why your roleplay suddenly feels different.

So my advice here is simple:

Don't ask yourself:

"Can I delete this?"

Ask yourself:

"What purpose is this serving?"

If you can't answer that question yet, don't delete it.

Understand it first.

Then improve it.

One of the biggest lessons I've learned while prompting is that you're rarely engineering outputs anymore.

You're engineering systems.

And systems don't fail because one instruction disappeared.

They fail because you accidentally removed a mechanism that was everything around it.
Why Prompts Become Bloated

Let's be honest.

Go open a prompt you wrote six months ago.

If your first thought is:

"Who the hell wrote this?"

Congratulations.

It was you…

Should I stop with the bad jokes?

probably

Will I?

You can’t force me :D

Prompt bloat is something that happens to almost everyone, and honestly, it's a completely natural part of learning.

At the beginning, the process usually looks like this:

Problem
↓
Add instruction
↓
Another problem
↓
Add instruction
↓
Another problem
↓
Add instruction

And for a while, it actually works.

Your prompt gets better.

The model behaves more consistently.

Life is good.

Then months pass.

You now have a prompt that looks like it has survived three world wars and five different authors.

Why?

Because every new idea was added on top of what already existed instead of being integrated into the existing systems.

This is probably the biggest reason prompts become bloated.

People ask themselves:
"Where can I add this?"

Instead of asking:
"Where does this belong?"

Or even better:
"Can I modify something that already exists so this becomes unnecessary?"

That's a huge difference.

Let's imagine NPCs aren't taking enough initiative.

One approach would be:
NPCs should take initiative.

Then later:
NPCs shouldn't wait for the user.

Then:
NPCs may progress scenes independently.

Then:
The world progresses autonomously.

Now you've written four instructions that are trying to solve almost the same problem.

Instead, you could revisit the existing narrative progression system and rewrite it so that it naturally includes NPC initiative.

Now one mechanism solves multiple symptoms.

And that's the mindset I try to follow when updating my own prompts.

I almost never ask:
"What can I add?"

I ask:
"What can I rewrite?"

Because a new idea shouldn't necessarily become a new paragraph.

Sometimes it should become a better sentence.

Sometimes it should replace an outdated explanation.

Sometimes it should merge two systems together.

And sometimes it should make three existing instructions unnecessary.

This also means that deleting things isn't always the right answer either.

Remember the previous chapter: redundancy and reinforcement are different concepts.

The goal isn't to make your prompt shorter.

The goal is to make every token work.

A 20-token instruction that changes how the entire workflow behaves can be more valuable than a 300-token explanation.

Likewise, three paragraphs saying almost the same thing aren't necessarily stronger than one well-designed mechanism that naturally produces the desired behavior.

So before adding a new section to your prompt, stop for a second and ask yourself:

    Can an existing instruction be modified instead?

    Can two systems be merged together?

    Am I solving the root cause or just patching a symptom?

    Does this idea deserve its own module, or should it become part of another one?

You'll be surprised how often the answer isn't "add another paragraph."

It's "rewrite an old one."

And in my experience, that's where prompt engineering starts feeling less like stacking LEGO bricks on top of each other and more like designing an actual system.
Testing and Iteration

At this point, you have your prompt.

You're happy with it.

You run a roleplay.

Something breaks.

Good.

That means you're actually testing it.

One of the biggest mistakes I see is people making huge rewrites every time they find a problem.

They modify three modules, rewrite the workflow, change two explanations, add a safeguard, remove another one, and then test again.

The result?

Maybe it works.

Maybe it doesn't.

But now they have absolutely no idea what actually changed.

That's why I almost always iterate with one specific objective in mind.

If I'm trying to improve dialogue, then that's what I'm working on.

Nothing else.

I implement the change.

I test it.

If it behaves the way I wanted, great. I move on to the next objective.

If it doesn't, I don't start changing five other things hoping one of them fixes it.

I keep working on that implementation until it does what I wanted.

Then I move on.

Is it perfect?

No.

I still make mistakes.

Sometimes I think a modification only affects one system and later discover it also changed something else.

That's completely normal.

But working with a single objective at a time makes those mistakes much easier to identify and fix.

Think about it.

If you change ten things and the output improves, what did it?

You don't know.

If you change ten things and the output gets worse, what caused it?

You don't know either.

You didn't run an experiment.

You rolled the dice.

That's why I prefer treating prompt development as a series of small iterations rather than giant rewrites.

Every change should answer a question.

"Will this improve dialogue?"

"Will this make NPC initiative more consistent?"

"Will this reduce repetition?"

Then test that hypothesis.

Only after you're satisfied should you move to the next one.

Ironically, this approach usually ends up being faster.

You spend less time wondering why something broke because you always know what you changed last.

And over time, that's how your prompt stops being a random collection of ideas and starts becoming a system that you actually understand.


Final Thoughts

Okay guys, honestly... this guide ended up being longer than I expected.

But I had a lot of fun writing it.

I even managed to get ChatGPT to hate me for a while because I told it it couldn't roleplay after it read the guide and immediately got defensive. So I guess I broke something there :D

And yes, I know I was lazy with some of the examples. Instead of creating completely new ones, I kept referring to parts of my own prompt. But honestly, I think using something that already works is a better way to explain these concepts than making up examples just for the guide.

For my final words, I want you to take a few ideas away from everything we've talked about.

    Workflows are generally much better than simple prompts when it comes to roleplaying. But a good workflow also contains prompting inside it. The two aren't enemies, they complement each other.

    Having a strong narrative core will make everything else easier. It becomes the backbone of your system, while details can evolve independently. I strongly recommend spending time designing one before worrying about fancy modules.

    Try to make generalized modules or plugins that can work with almost any narrative core. These should behave like simple extensions to your main system rather than entire systems by themselves.

    Never use negative prompting alone. Use it to reinforce positive prompting by telling the model what to avoid, not as the only instruction it receives.

    Having well-written instructions is important, but choosing the correct kind of instruction is even more important. Sometimes you need a prompt. Sometimes you need a workflow. Sometimes you need an explanation. Learning when to use each one is half of prompt engineering.

    Activation conditions are something you should almost always have for modules or plugins that aren't supposed to be active all the time. Don't assume the model will magically know when to apply them. Tell it.

    Prompt bloat is completely normal when you're starting. Don't be afraid of it, but be conscious of it. Try to integrate ideas into existing systems instead of endlessly stacking new paragraphs on top of old ones.

    If your prompt starts failing after you update it, that's normal too. Don't get frustrated. You're modifying a system, and systems have dependencies. Embrace the process. Over time you'll get better at understanding why things work instead of just noticing that they do.

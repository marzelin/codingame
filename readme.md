<style>
</style>
<div class="statement-section statement-goal">
<h1><span class="icon icon-goal">&nbsp;</span> <span>The Goal</span></h1>

<div class="statement-goal-content"><!-- LEAGUES wood3 wood2 wood1 bronze -->Your objective is to produce a maximum amount of <strong>cyborgs</strong> in order to destroy those of your opponent. To this end, you must take ownership of <strong>factories</strong> that will enable you to increase the size of your cyborg army.</div>
</div>
<!-- RULES -->

<div class="statement-section statement-rules">
<h1><span class="icon icon-rules">&nbsp;</span> <span>Rules</span></h1>

<div>
<div class="statement-rules-content">
<p>The game is played with 2 players on a board on which a variable number of <strong>factories</strong> are placed (from <const>7</const> to <const>15</const> factories). Initially, each player holds a single factory in which there is a stock of <const>15</const> to <const>30</const> cyborgs. The other factories are neutral but also have cyborgs defending them.</p>

<p>On each turn, a player can send any number of cyborgs from one factory to another. The cyborgs in transit form a <strong>troop</strong>. This <strong>troop</strong> will take between <const>1</const> and <const>20</const> turns to reach its destination. When the <strong>troop</strong> arrives, the cyborgs will fight with any opponent cyborgs present at the factory.</p>

<p><strong>Factory placement</strong><br>
<br>
Factories are placed randomly across the map at the start of each game. The player is given the distance between each factory, expressed as the number of turns it takes to reach a factory starting from another.</p>

<p><strong>Game Turn</strong><br>
<br>
One game turn is computed as follows:</p>

<ul>
	<li>Move existing troops and bombs</li>
	<li>Execute user orders</li>
	<li>Produce new cyborgs in all factories</li>
	<li>Solve battles</li>
	<li>Make the bombs explode</li>
	<li>Check end conditions</li>
</ul>

<p>&nbsp;</p>

<p><strong>Cyborg Production</strong><br>
<br>
Each turn, every non-neutral factory produces between <const>0</const> and <const>3</const> cyborgs.</p>

<div class="statement-example-container">
<div class="statement-example"><img src="./static-assets/cyborg-production.png" style="padding: 20px;"></div>
</div>

<p>&nbsp;</p>

<p><strong>Battles</strong><br>
<br>
To conquer a factory, you must send cyborgs to the coveted factory. Battles are played in this order:</p>

<ol>
	<li>Cyborgs that reach the same destination on the same turn fight between themselves.</li>
	<li>Remaining cyborgs fight against the ones already present in the factory (beware that the cyborgs currently leaving do not fight).</li>
</ol>
If the number of attacking cyborgs is greater than the number of cyborgs in defense, the factory will then belong to the attacking player and it will start producing new cyborgs for this player on the next turn.

<div class="statement-example-container">
<div class="statement-example" style="max-width: 400px"><img src="static-assets/battle-explanation.png" style="padding: 20px; "></div>
</div>

<p>&nbsp;</p>

<p><strong>Bombs</strong><br>
<br>
Each player possesses <const>2</const> <strong>bombs</strong> for each game. A bomb can be sent from any factory you control to any factory. The corresponding action is: <action>BOMB</action> <var>source</var> <var>destination</var>, where <var>source</var> is the identifier of the source factory, and <var>destination</var> is the identifier of the destination factory.<br>
<br>
When a bomb reaches a factory, half of the cyborgs in the factory are destroyed (floored), for a minimum of 10 destroyed cyborgs. For example, if there are 33 cyborgs, 16 will be destroyed. But if there are only 13 cyborgs, 10 will be destroyed.<br>
<br>
<strong>Following a bomb explosion, the factory won't be able to produce any new cyborgs during <const>5</const> turns.</strong><br>
<br>
Be careful, your radar is able to detect the launch of a bomb but you don't know where its target is!<br>
<br>
It is impossible to send a bomb and a troop at the same time from the same factory and to the same destination. If you try to do so, only the bomb will be sent.</p>

<p><strong>Production Increase</strong><br>
<br>
At any moment, you can decide to sacrifice 10 cyborgs in a factory to indefinitely increase its production by one cyborg per turn. A factory will not be able to produce more than <const>3</const> cyborgs per turn. The corresponding action is: <action>INC</action> <var>factory</var>, where <var>factory</var> is the identifier of the factory that you want to improve.</p>
</div>
<!-- Victory conditions -->

<div class="statement-victory-conditions">
<div class="icon victory">&nbsp;</div>

<div class="blk">
<div class="title">Victory Conditions</div>

<div class="text">
<ul>
	<li>Your opponent has no cyborgs left, nor any factories capable of producing new cyborgs.</li>
	<li>You have more cyborgs than your opponent after 200 turns.</li>
</ul>
</div>
</div>
</div>
</div>
</div>
<!-- EXPERT RULES -->

<div class="statement-section statement-expertrules">
<h1><span class="icon icon-expertrules">&nbsp;</span> <span>Expert Rules</span></h1>

<div class="statement-expert-rules-content">Because a source code is worth a thousand words, you can access to the code of the "Referee" on <a href="https://github.com/CodinGame/ghost-in-the-cell/blob/master/Referee.java" target="_blank">our GitHub</a>.</div>
</div>
<!-- PROTOCOL -->

<div class="statement-section statement-protocol">
<h1><span class="icon icon-protocol">&nbsp;</span> <span>Game Input</span></h1>
<!-- Protocol block -->

<div class="blk">
<div class="title">Initialization input</div>

<div class="text"><span class="statement-lineno">Line 1:</span><var>factoryCount</var>, the number of factories.<br>
<span class="statement-lineno">Line 2:</span><var>linkCount</var>, the number of links between factories.<br>
<span class="statement-lineno">Next <var>linkCount</var> lines:</span> 3 space-separated integers <var>factory1</var>, <var>factory2</var> and <var>distance</var>, where <var>distance</var> is the number of turns needed for a troop to travel between <var>factory1</var> and <var>factory2</var>.</div>
</div>
<!-- Protocol block -->

<div class="blk">
<div class="title">Input for one game turn</div>

<div class="text"><span class="statement-lineno">Line 1:</span> an integer <var>entityCount</var>, the number of entities.<br>
<span class="statement-lineno">Next <var>entityCount</var> lines:</span> an integer <var>entityId</var>, a string <var>entityType</var> and 5 integers <var>arg1</var>, <var>arg2</var>, <var>arg3</var>, <var>arg4</var> and <var>arg5</var>.<br>
<br>
If <var>entityType</var> equals <const>FACTORY</const> then the arguments are:

<ul>
	<li><var>arg1</var>: player that owns the factory: <const>1</const> for you, <const>-1</const> for your opponent and <const>0</const> if neutral</li>
	<li><var>arg2</var>: number of cyborgs in the factory</li>
	<li><var>arg3</var>: factory production (between 0 and 3)</li>
	<li><var>arg4</var>: number of turns before the factory starts producing again (0 means that the factory produces normally)</li>
	<li><var>arg5</var>: unused</li>
</ul>
If <var>entityType</var> equals <const>TROOP</const> then the arguments are:

<ul>
	<li><var>arg1</var>: player that owns the troop: <const>1</const> for you or <const>-1</const> for your opponent</li>
	<li><var>arg2</var>: identifier of the factory from where the troop leaves</li>
	<li><var>arg3</var>: identifier of the factory targeted by the troop</li>
	<li><var>arg4</var>: number of cyborgs in the troop (positive integer)</li>
	<li><var>arg5</var>: remaining number of turns before the troop arrives (positive integer)</li>
</ul>
If <var>entityType</var> equals <const>BOMB</const> then the arguments are:

<ul>
	<li><var>arg1</var>: player that send the bomb: <const>1</const> if it is you, <const>-1</const> if it is your opponent</li>
	<li><var>arg2</var>: identifier of the factory from where the bomb is launched</li>
	<li><var>arg3</var>: identifier of the targeted factory if it's your bomb, <const>-1</const> otherwise</li>
	<li><var>arg4</var>: remaining number of turns before the bomb explodes (positive integer) if that's your bomb, <const>-1</const> otherwise</li>
	<li><var>arg5</var>: unused</li>
</ul>
</div>
</div>
<!-- Protocol block -->

<div class="blk">
<div class="title">Output for one game turn</div>

<div class="text">The available actions are:
<ul>
	<li><action>MOVE</action> <var>source</var> <var>destination</var> <var>cyborgCount</var>: creates a troop of <var>cyborgCount</var> cyborgs at the factory <var>source</var> and sends that troop towards <var>destination</var>. Example: <action>MOVE 2 4 12</action> will send 12 cyborgs from factory 2 to factory 4.</li>
	<li><action>BOMB</action> <var>source</var> <var>destination</var>: creates a bomb in the factory <var>source</var> and sends it towards <var>destination</var>.</li>
	<li><action>INC</action> <var>factory</var>: increases the production of the factory <var>factory</var> at the cost of <const>10</const> cyborgs.</li>
	<li><action>WAIT</action>: does nothing.</li>
	<li><action>MSG</action> <var>message</var>: prints a message on the screen.</li>
</ul>
You may use several actions by using a semi-colon <action>;</action>. Example: <action>MOVE 1 3 18</action> <action>;</action> <action>MSG Attack Factory 3</action>. If you try to move more cyborgs that there are in the source factory, then all the available units will be sent.</div>
</div>
<!-- Protocol block -->

<div class="blk">
<div class="title">Constraints</div>

<div class="text"><const>7</const> ≤ <var>factoryCount</var> ≤ <const>15</const><br>
<const>21</const> ≤ <var>linkCount</var> ≤ <const>105</const><br>
<const>1</const> ≤ <var>distance</var> ≤ <const>20</const><br>
Response time for first turn ≤ 1000ms<br>
Response time for one turn ≤ 50ms</div>
</div>
</div>
</div>
</div>
</cg-statement>
					</div>
				</div>
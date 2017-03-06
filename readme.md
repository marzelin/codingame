<div class="statement-body">
<div class="statement-section statement-goal">
   <h2><span class="icon icon-goal">&nbsp;</span><span>Goal </span></h2>
   <span class="question-statement">The classic game of Hanoi tower consists of a stack of wooden disks of various, unique size and three axes. At the beginning of the game, all disks are stacked on the left axis, in decreasing size (largest disk at the bottom). The goal of the game is to move the entire stack to the right axis, moving one disk at a time and always placing a disk on an empty stack or a larger disk.<br><br>A trivial algorithm for solving the game is the following:<br> - move the smallest disk one axis to the <var>right</var> if the number of disks is even, to the <var>left</var> if the number of disks is odd<br> - then make the single other possible move not involving the smallest disk<br> - reiterate this process until the stack is fully on the rightmost axis<br><br>You must write a program that implements this algorithm and:<br> 1. computes the number of steps required to complete the game<br> 2. displays the state of the game after a given number of turns</span>
</div>
<div class="statement-section statement-protocol">
   <div class="blk">
      <div class="title">Input</div>
      <div class="question-statement-input"><strong>Line 1:</strong> <var>N</var> , the number of disks.<br><strong>Line 2:</strong> <var>T</var>, the turn for which you must display the game state</div>
   </div>
   <div class="blk">
      <div class="title">Output</div>
      <div class="question-statement-output"><strong><var>N</var> lines:</strong> a graphical representation of the game state at turn <var>T</var>:<br> - the three axes must be evenly spaced to accommodate all disks and are <var>N</var> lines high<br> - the empty parts of the axes are represented with the character <const>|</const><br> - disks are represented with the character <const>#</const>, on each side of the axis and on the axis itself<br> - the smallest disk has radius 1, the largest disk has radius <var>N</var>, i.e. a disk with radius 2 is effectively 5 chars wide, including the axis in the middle<br> - axes are separated by a single space<br> - do not output spaces at the end of lines<br><strong>Following line:</strong> the number of turns needed to complete the game</div>
   </div>
   <div class="blk">
      <div class="title">Constraints</div>
      <div class="question-statement-constraints"><const>3</const>&lt;=<var>N</var>&lt;=<const>10</const><br><const>1</const>&lt;=<var>T</var>&lt;=<const>2^<var>N</var>-1</const></div>
   </div>
   <div class="blk">
      <div class="title">Example</div>
      <div class="statement-inout">
         <div class="statement-inout-in">
            <div class="title">Input</div>
            <pre class="question-statement-example-in">3
6
</pre>
         </div>
         <div class="statement-inout-out">
            <div class="title">Output</div>
            <pre class="question-statement-example-out">   |       |       |
   |       |     #####
  ###      |    #######
7
</pre>
         </div>
      </div>
   </div>
</div></div>
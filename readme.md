<div class="statement-body">
<div class="statement-section statement-goal">
   <h2><span class="icon icon-goal">&nbsp;</span><span>Goal </span></h2>
   <span class="question-statement">A sandpile is a square matrix of natural numbers between 0 and 3, representing how many grains of sand there is on each square<br>To add two sandpiles, just start by adding the two matrices element by element. Except the matrix you generate might not be a sandpile, if one of its element is higher than 3 you must transform this matrix into a sanpile, and this is how it is done :<br> - If a square has 4 grains of sand or more, it "loses" four and distributes it to its four neighbors (if the square touches an edge, the grain of sand is lost)<br> - Keep doing that to all the squares with 4 grains or more until all the squares have 3 grains or less<br><br>Example :<br><pre style="font-family: monospace">000   000   000    010<br>020 + 020 = 040 -&gt; 101<br>000   000   000    010<br></pre></span>
</div>
<div class="statement-section statement-protocol">
   <div class="blk">
      <div class="title">Input</div>
      <div class="question-statement-input"><strong>Line 1 : </strong>An integer <var>n</var>, the size of the two sandpiles<br><strong><var>2*n</var> next lines : </strong>The two sandpiles</div>
   </div>
   <div class="blk">
      <div class="title">Output</div>
      <div class="question-statement-output"><var>n</var> lines representing the resulting sandpile</div>
   </div>
   <div class="blk">
      <div class="title">Constraints</div>
      <div class="question-statement-constraints">2 ≤ <var>N</var> ≤ 10</div>
   </div>
   <div class="blk">
      <div class="title">Example</div>
      <div class="statement-inout">
         <div class="statement-inout-in">
            <div class="title">Input</div>
            <pre class="question-statement-example-in">3
121
202
121
020
202
020</pre>
         </div>
         <div class="statement-inout-out">
            <div class="title">Output</div>
            <pre class="question-statement-example-out">313
101
313</pre>
         </div>
      </div>
   </div>
</div></div>


Implement aggresion (RVO paper)

adaptive aggresion\

* baseline aggression, slowly naturally return to
* decreases slowly for each robot nearby
* Decreases faster for the more aggressive each robot nearby is
* Increase aggression the farther your goal

The goal is 
* in large crowds no one is aggressive.
* when two boids come towards each other, the one with a farther goal maintains its aggression while the other quickly becomes non-aggressive.
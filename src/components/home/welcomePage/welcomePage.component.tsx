const DndcadWelcomePage = () => {
  return (
    <>
      <h2>A Character-a-Day Repository</h2>
      <p>
        This is a repository for storing basic information about D&D characters.
        Currently, it is not intended to replace a character sheet or a
        generator, merely a way to give a glance of what a character is about.
        Included fields are base attributes, personality traits, ideals, bonds,
        flaws, history, physical descriptors. I plan to add an optional image as
        well.
      </p>
      <p>
        Currently the only utility for generating a character is a semi-randomly
        selected race and class combination with base attributes rolled.*
      </p>
      <p>
        * The method for rolling stats uses my homebrewed process. When using
        the dice-roll method of character creation, a player may choose to
        discard a set of rolled attributes and reroll a completely new set of
        ability scores if the cost to purchase the stats using the variant
        point-buy system would be less than 27. All six ability scores must be
        rerolled.
      </p>
    </>
  );
};

export default DndcadWelcomePage;

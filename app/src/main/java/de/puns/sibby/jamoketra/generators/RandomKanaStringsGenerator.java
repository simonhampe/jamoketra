package de.puns.sibby.jamoketra.generators;

import java.util.Random;

import de.puns.sibby.jamoketra.shared.CharacterType;

/**
 * This class generates random strings of either Hiragana or Katakana
 */
public class RandomKanaStringsGenerator {

    private CharacterType characterType;
    private int minLength;
    private int maxLength;
    private Random random = new Random();

    /**
     * Creates a new generator, which can produce random Kana strings.
     * @param characterType The character type. This generator will only produce string containing this type of Kana.
     * @param minLength The minimal length of each generated string.
     * @param maxLength The maximal length of each generated string.
     */
    public RandomKanaStringsGenerator(CharacterType characterType, int minLength, int maxLength) {
        if(characterType == null || minLength <= 0 || maxLength <= 0 || maxLength < minLength) {
            throw new IllegalArgumentException("Invalid parameters.");
        }
        this.characterType = characterType;
        this.minLength = minLength;
        this.maxLength = maxLength;
    }

    /**
     * This produces a random Kana string according to the object's parameters.
     * @return The generated string.
     */
    public String generateString() {
        int length = getRandomLength();
        StringBuilder builder = new StringBuilder();
        for(int i = 0; i < length; i++) {
            builder.append(getRandomChar());
        }
        return builder.toString();
    }

    int getRandomLength() {
        return random.nextInt(maxLength - minLength + 1) + minLength;
    }

    char getRandomChar() {
        String characters = characterType.getCharacterList();
        return characters.charAt(random.nextInt(characters.length()));
    }


}


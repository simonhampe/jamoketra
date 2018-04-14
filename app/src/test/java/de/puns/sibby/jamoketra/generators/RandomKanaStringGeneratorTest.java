package de.puns.sibby.jamoketra.generators;


import org.junit.Test;

import de.puns.sibby.jamoketra.shared.CharacterType;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

public class RandomKanaStringGeneratorTest {

    private static final int STATISTICAL_RUNS = 1000;

    @Test(expected = IllegalArgumentException.class)
    public void testCreateWithMismatchedLengths() {
        new RandomKanaStringsGenerator(CharacterType.HIRAGANA,2,1);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testCreateWithZeroLength() {
        new RandomKanaStringsGenerator(CharacterType.HIRAGANA, 0, 2);
    }

    @Test(expected = IllegalArgumentException.class)
    public void testCreateWithoutCharacterType() {
        new RandomKanaStringsGenerator(null, 1,2);
    }

    @Test
    public void testGenerateIsAtLeastMinLength() {
        // Setup
        RandomKanaStringsGenerator generator = spy(new RandomKanaStringsGenerator(CharacterType.HIRAGANA, 1,2));
        doReturn(1).when(generator).getRandomLength();
        doReturn('a').when(generator).getRandomChar();

        // Execute method under test
        String result = generator.generateString();

        // Verify result
        assertEquals(new String("a"),result);
    }

    @Test
    public void testGetRandomLength() {
        int minLength = 1;
        int maxLength = 10;
        RandomKanaStringsGenerator generator = new RandomKanaStringsGenerator(CharacterType.HIRAGANA, minLength, maxLength);
        for(int i = 0; i < STATISTICAL_RUNS; i++) {
            int value = generator.getRandomLength();
            assertTrue(value >= minLength && value <= maxLength);
        }
    }

    @Test
    public void testGetRandomCharHiragana() {
        int length = 5;
        RandomKanaStringsGenerator generator = new RandomKanaStringsGenerator(CharacterType.HIRAGANA, length, length);
        for(int i = 0; i < STATISTICAL_RUNS; i++) {
            String value = String.valueOf(generator.getRandomChar());
            assertTrue(CharacterType.HIRAGANA.getCharacterList().contains(value));
        }
    }

    @Test
    public void testGetRandomCharKatakana() {
        int length = 5;
        RandomKanaStringsGenerator generator = new RandomKanaStringsGenerator(CharacterType.KATAKANA, length, length);
        for(int i = 0; i < STATISTICAL_RUNS; i++) {
            String value = String.valueOf(generator.getRandomChar());
            assertTrue(CharacterType.KATAKANA.getCharacterList().contains(value));
        }
    }
}

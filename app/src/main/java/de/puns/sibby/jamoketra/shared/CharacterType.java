package de.puns.sibby.jamoketra.shared;

public enum CharacterType {

    HIRAGANA("あいうえおかがきぎくぐけげこごさざしじすずせぜそぞただちぢつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもやゆよらりるれろわをん"),
    KATAKANA("アイウエオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤユヨラリルレロワヲン");

    private String characterList;

    CharacterType(String characterList) {
        this.characterList = characterList;
    }

    public String getCharacterList() {
        return characterList;
    }

}

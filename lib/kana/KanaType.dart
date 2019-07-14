class KanaGroup {
  final String _characters;

  const KanaGroup._internal_from_chars(this._characters);

  KanaGroup._internal_from_groups(List<KanaGroup> groups):
    _characters = groups.map((group) => group._characters).join("");

  get characters => _characters;

  static const AGROUP_HIRAGANA = KanaGroup._internal_from_chars("あいうえお");

  static const KGROUP_HIRAGANA = KanaGroup._internal_from_chars("かきくけこ");
  static const KRGOUP_TENTEN_HIRAGANA = KanaGroup._internal_from_chars("がぎぐげご");

  static const SGROUP_HIRAGANA = KanaGroup._internal_from_chars("さしすせそ");
  static const SGROUP_TENTEN_HIRAGANA = KanaGroup._internal_from_chars("ざじずぜぞ");

  static const TGROUP_HIRAGANA = KanaGroup._internal_from_chars("たちつてと");
  static const TGROUP_TENTEN_HIRAGANA = KanaGroup._internal_from_chars("だぢづでど");

  static const NGROUP_HIRAGANA = KanaGroup._internal_from_chars("なにぬねの");

  static const HGROUP_HIRAGANA = KanaGroup._internal_from_chars("はひふへほ");
  static const HGROUP_TENTEN_HIRAGANA = KanaGroup._internal_from_chars("ばびぶべぼ");
  static const HGROUP_MARU_HIRAGANA = KanaGroup._internal_from_chars("ぱぴぷぺぽ");

  static const MGROUP_HIRAGANA = KanaGroup._internal_from_chars("まみむめも");

  static const YGROUP_HIRAGANA = KanaGroup._internal_from_chars("やゆよ");

  static const RGROUP_HIRAGANA = KanaGroup._internal_from_chars("らりるれろ");

  static const SPECIAL_GROUP_HIRAGANA = KanaGroup._internal_from_chars("わをん");

  static const AGROUP_KATAKANA = KanaGroup._internal_from_chars("アイウエオ");

  static const KGROUP_KATAKANA = KanaGroup._internal_from_chars("カキクケコ");
  static const KRGOUP_TENTEN_KATAKANA = KanaGroup._internal_from_chars("ガギグゲゴ");

  static const SGROUP_KATAKANA = KanaGroup._internal_from_chars("サシスセソ");
  static const SGROUP_TENTEN_KATAKANA = KanaGroup._internal_from_chars("ザジズゼゾ");

  static const TGROUP_KATAKANA = KanaGroup._internal_from_chars("タチツテト");
  static const TGROUP_TENTEN_KATAKANA = KanaGroup._internal_from_chars("ダヂヅデド");

  static const NGROUP_KATAKANA = KanaGroup._internal_from_chars("ナニヌネノ");

  static const HGROUP_KATAKANA = KanaGroup._internal_from_chars("ハヒフヘホ");
  static const HGROUP_TENTEN_KATAKANA = KanaGroup._internal_from_chars("バビブベボ");
  static const HGROUP_MARU_KATAKANA = KanaGroup._internal_from_chars("パピプペポ");

  static const MGROUP_KATAKANA = KanaGroup._internal_from_chars("マミムメモ");

  static const YGROUP_KATAKANA = KanaGroup._internal_from_chars("ヤユヨ");

  static const RGROUP_KATAKANA = KanaGroup._internal_from_chars("ラリルレロ");

  static const SPECIAL_GROUP_KATAKANA = KanaGroup._internal_from_chars("ワヲン");


}

class KanaType {
  final String _characters;

  const KanaType._internal(this._characters);

  get characters => _characters;

  static const HIRAGANA = KanaType._internal(
      "あいうえおかがきぎくぐけげこごさざしじすずせぜそぞただちぢつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもやゆよらりるれろわをん");
  static const KATAKANA = KanaType._internal(
      "アイウエオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤユヨラリルレロワヲン");
}

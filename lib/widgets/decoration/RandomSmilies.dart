import 'dart:math';


class RandomSmilies {
  static final happySmilies = ["(≧∇≦)b", "(≧▽≦)", "＼(^o^)／", "٩(♡ε♡ )۶"];
  static final angrySmilies = ["٩(๑`^´๑)۶", "(๑•̀ㅁ•́๑)✧", "(๑•̀ㅂ•́)و✧"];

  static final Random random = new Random();

  static String getRandomHappySmiley() {
    return happySmilies[random.nextInt(happySmilies.length)];
  }

  static String getRandomAngrySmiley() {
    return angrySmilies[random.nextInt(angrySmilies.length)];
  }
}

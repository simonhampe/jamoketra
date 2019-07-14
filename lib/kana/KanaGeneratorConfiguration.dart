import 'KanaType.dart';

abstract class KanaGeneratorConfiguration {
  String getAllowedChars();
}

class KanaGroupConfiguration implements KanaGeneratorConfiguration {
  Set<KanaGroup> allowedGroups;

  @override
  String getAllowedChars() {
    return allowedGroups.map((group) => group.characters).join("");
  }
}

from main import rule_based_triage


def test_bleeding_is_emergency():
    result = rule_based_triage("I am bleeding and feel dizzy")
    assert result is not None
    assert result["urgency"] == "emergency"


def test_reduced_baby_movement_is_emergency():
    result = rule_based_triage("My baby is not moving today")
    assert result is not None
    assert result["urgency"] == "emergency"


def test_fever_is_caution():
    result = rule_based_triage("I have fever and chills")
    assert result is not None
    assert result["urgency"] == "caution"


def test_mild_unknown_symptom_uses_ai_or_fallback():
    assert rule_based_triage("I feel a little tired") is None

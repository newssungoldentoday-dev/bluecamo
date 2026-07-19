# Python - AI moderation
import sys
def moderate(text: str):
    banned = ["spam", "scam"]
    return not any(w in text.lower() for w in banned)

if "--test" in sys.argv:
    assert moderate("hello world") == True
    print("Python moderation OK")

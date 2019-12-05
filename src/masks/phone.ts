function formatPhoneNumber(phoneNumberString: string) {
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    var intlCode = match[1] ? "+1 " : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }

  return phoneNumberString;
}

export default function phoneMask(s: string) {
  try {
    return formatPhoneNumber(s) || "";
  } catch (err) {
    console.error("error with phone validation", err);
  }
}

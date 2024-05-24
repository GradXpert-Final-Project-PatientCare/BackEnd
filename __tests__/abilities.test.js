const { defineAbilityFor } = require("../src/helpers/abilities");

describe("Role Base Permission", () => {
  const user = {
    role: "user",
  };
  const admin = {
    role: "admin",
  };

  test("define ability for user", () => {
    const ability = defineAbilityFor(user);
    expect(ability).not.toBeNull();
  });

  test("define ability for admin", () => {
    const ability = defineAbilityFor(admin);
    expect(ability).not.toBeNull();
  });
});

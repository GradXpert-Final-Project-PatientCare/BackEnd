const { AbilityBuilder, PureAbility } = require("@casl/ability");

function defineAbilityFor(user) {
    return new PureAbility(defineRulesFor(user));
}

function defineRulesFor(user) {
  const builder = new AbilityBuilder(PureAbility);

  if (user.role === "admin") {
    defineAdminRules(builder);
  } else {
    defineUserRules(builder, user);
  }

  return builder.rules;
}

function defineAdminRules({ can }) {
  can("manage", "all");
}

function defineUserRules({ can }, user) {
  can(["read", "create", "update"], "Appointment");
  can(["read"], "User");
  can(["read"], "Timeslot");
}

module.exports = {
  defineRulesFor,
  defineAbilityFor,
};

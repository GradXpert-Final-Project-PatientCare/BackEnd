const { AbilityBuilder, PureAbility } = require("@casl/ability");

function defineAbilityFor(user) {
  if (user) {
    return new PureAbility(defineRulesFor(user));
  }

  return new PureAbility(defineRulesFor({}));
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
  can(["read"], "Doctor");
  can(["read"], "Schedule");
  can(["read"], "Timeslot");
  can(["read"], "User");
}

module.exports = {
  defineRulesFor,
  defineAbilityFor,
};

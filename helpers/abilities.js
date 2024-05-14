const { AbilityBuilder, PureAbility } = require('@casl/ability');

function defineAbilityFor(user) {
  if (user) {
    return new PureAbility(defineRulesFor(user));
  }

  return new PureAbility(defineRulesFor({}));
}

function defineRulesFor(user) {
  const builder = new AbilityBuilder(PureAbility);

  switch (user.role) {
    case 'admin':
      defineAdminRules(builder);
      break;
    case 'doctor':
      defineDoctorRules(builder);
      break;
    default:
      defineUserRules(builder, user);
      break;
  }

  return builder.rules;
}

function defineAdminRules({ can }) {
  can('manage', 'all');
}

function defineDoctorRules({ can }, user) {
  can(['read', 'update'], 'Appointment');
  can(['read'], 'Doctor');
  can(['read', 'create', 'update', 'delete'], 'Schedule');
  can(['read'], 'User');
}

function defineUserRules({ can }, user) {
  can(['read', 'create', 'update'], 'Appointment');
  can(['read'], 'Doctor');
  can(['read'], 'Schedule');
  can(['read'], 'User');
}

module.exports = {
  defineRulesFor,
  defineAbilityFor,
};
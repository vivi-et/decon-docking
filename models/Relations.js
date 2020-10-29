const User = require('./User');
const Notice = require('./Notice');
const Article = require('./Article');
const Design = require('./Design');

User.hasMany(Notice);
Notice.belongsTo(User);
User.hasMany(Article);
Article.belongsTo(User);
User.hasMany(Design);
Design.belongsTo(User);


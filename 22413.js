const fs = require("fs");
const path = require("path");

class TemplateEngine {
  constructor(options = {}) {
    this.config = {
      defaultLayout: "main",
      layoutsDir: "./views/layouts",
      partialsDir: "./views/partials",
      extname: ".22413",
      encoding: "utf8",
      helpers: {},
      individualMark: "22413",
    };

    this.config = { ...this.config, ...options };

    this.templates = {};
    this.helpers = this.config.helpers || {};
  }

  engine() {
    return (filePath, options, callback) => {
      try {
        fs.readFile(filePath, this.config.encoding, (err, content) => {
          if (err) return callback(err);

          try {
            const context = { ...options };

            this.registerLayoutTemplate();
            this.registerPartialTemplates();

            const renderedBody = this.render(content.toString(), context);

            let finalContent = renderedBody;
            if (this.templates["layout"]) {
              context.body = renderedBody;
              finalContent = this.render(this.templates["layout"], context);
            }

            return callback(null, finalContent);
          } catch (renderError) {
            return callback(renderError);
          }
        });
      } catch (error) {
        callback(error);
      }
    };
  }

  registerLayoutTemplate() {
    const layoutPath = path.join(
      this.config.layoutsDir,
      `${this.config.defaultLayout}${this.config.extname}`
    );

    if (fs.existsSync(layoutPath)) {
      const layoutContent = fs.readFileSync(layoutPath, this.config.encoding);
      this.templates["layout"] = layoutContent;
    }
  }

  registerPartialTemplates() {
    const partialsPath = path.resolve(this.config.partialsDir);

    if (fs.existsSync(partialsPath)) {
      fs.readdirSync(partialsPath)
        .filter((file) => file.endsWith(this.config.extname))
        .forEach((file) => {
          const partialName = path.basename(file, this.config.extname);
          const partialContent = fs.readFileSync(
            path.join(partialsPath, file),
            this.config.encoding
          );
          this.templates[partialName] = partialContent;
        });
    }
  }

  registerTemplate(name, content) {
    this.templates[name] = content;
  }

  render(template, context) {
    const fullContext = {
      ...context,
      _helpers: this.helpers,
    };

    let handledTemplate = this.handleTemplateReplacement(template);
    handledTemplate = this.handleNested(handledTemplate, fullContext);
    return this.renderFinalTemplate(handledTemplate, fullContext);
  }

  applyHelper(helperName, ...args) {
    const context = args.pop();

    const helper = this.helpers[helperName];
    if (typeof helper === "function") {
      return helper(...args, context);
    }

    return "";
  }

  renderFinalTemplate(template, context) {
    const mark = this.config.individualMark;
    const regex = new RegExp(`${mark}{(.*?)}`, "g");

    return template.replace(regex, (match, expression) => {
      const trimmedExp = expression.trim();

      const helperMatch = trimmedExp.match(/^_helpers\.(\w+)\((.*?)\)$/);
      if (helperMatch) {
        const [, helperName, helperArgs] = helperMatch;
        const args = helperArgs
          ? helperArgs
              .split(",")
              .map((arg) => {
                const trimmedArg = arg.trim();
                return (
                  this.getNestedValue(context, trimmedArg) ||
                  trimmedArg.replace(/^['"]|['"]$/g, "")
                );
              })
              .concat(context)
          : [context];

        return this.applyHelper(helperName, ...args);
      }

      if (trimmedExp === ".") {
        return context["."] ?? match;
      }

      const value = this.getNestedValue(context, trimmedExp);
      return value !== undefined ? value : match;
    });
  }

  handleTemplateReplacement(template) {
    const mark = this.config.individualMark;
    const templateRegex = new RegExp(`${mark}{\\+\\s*([^}]+)}`, "g");

    return template.replace(templateRegex, (match, templateName) => {
      return this.templates[templateName.trim()] || "";
    });
  }

  handleNested(template, context) {
    const mark = this.config.individualMark;
    const nestedRegex = new RegExp(
      [`${mark}{(if|for)\\s+([^}]+)}`, "([\\s\\S]*?)", `{/(if|for)}`].join(""),
      "g"
    );

    let result = template;
    let match;

    while ((match = nestedRegex.exec(result)) !== null) {
      const [fullMatch, type, condition, content] = match;
      let replacement = "";

      if (type === "if") {
        replacement = this.handleCondition(condition, content, context);
      } else if (type === "for") {
        replacement = this.handleLoop(condition, content, context);
      }

      result = result.replace(fullMatch, replacement);
      nestedRegex.lastIndex = 0;
    }

    return result;
  }

  handleCondition(condition, content, context) {
    const trimmedCondition = condition.trim();
    const conditionResult = this.evaluateCondition(trimmedCondition, context);

    const elseRegex = /^(.*){else}(.*)$/s;
    const elseMatch = content.match(elseRegex);

    if (elseMatch) {
      const trueContent = elseMatch[1].trim();
      const falseContent = elseMatch[2].trim();

      const handledTrueContent = this.handleNested(trueContent, context);
      const handledFalseContent = this.handleNested(falseContent, context);

      return conditionResult
        ? this.renderFinalTemplate(handledTrueContent, context)
        : this.renderFinalTemplate(handledFalseContent, context);
    }

    return conditionResult
      ? this.renderFinalTemplate(this.handleNested(content, context), context)
      : "";
  }

  handleLoop(condition, content, context) {
    const loopMatch = condition.match(/(\w+)\s+in\s+(\w+(\.\w+)*)/);
    if (!loopMatch) return "";

    const [, itemVar, arrayPath] = loopMatch;
    const array = this.getNestedValue(context, arrayPath);

    if (!Array.isArray(array)) return "";

    return array
      .map((item) => {
        const loopContext = {
          ...context,
          [itemVar]: item,
        };

        const handledContent = this.handleNested(content, loopContext);
        return this.renderFinalTemplate(handledContent, loopContext);
      })
      .join("");
  }

  evaluateCondition(condition, context) {
    if (condition.includes("!=")) {
      const [left, right] = condition.split("!=").map((part) => part.trim());
      const leftValue = this.getNestedValue(context, left);
      const rightValue = this.getNestedValue(context, right);
      return leftValue != rightValue;
    }

    if (condition.includes("===")) {
      const [left, right] = condition.split("===").map((part) => part.trim());
      const leftValue = this.getNestedValue(context, left);
      const rightValue = this.getNestedValue(context, right);
      return leftValue === rightValue;
    }

    if (condition.includes("==")) {
      const [left, right] = condition.split("==").map((part) => part.trim());
      const leftValue = this.getNestedValue(context, left);
      const rightValue = this.getNestedValue(context, right);
      return leftValue == rightValue;
    }

    const value = this.getNestedValue(context, condition);
    return !!value;
  }

  getNestedValue(obj, path) {
    if (path == "null") return null;

    return path
      .split(".")
      .reduce(
        (acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined),
        obj
      );
  }
}

function create(options) {
  const engine = new TemplateEngine(options);
  return engine.engine();
}

module.exports = {
  engine: create,
};

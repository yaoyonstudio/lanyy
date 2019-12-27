#!/usr/bin/env node

var inquirer = require("inquirer");
var shell = require("shelljs");
var commander = require("commander");
var program = new commander.Command();

program.version("0.0.1");

var repositories = [
  "https://github.com/yaoyonstudio/t-vue-template.git",
  "https://github.com/yaoyonstudio/t-vuex-template.git",
  "https://github.com/yaoyonstudio/t-web-template.git",
  "https://github.com/yaoyonstudio/t-taro-template.git",
  "https://github.com/yaoyonstudio/t-uniapp-template.git"
];

var questions = [
  {
    type: "input",
    name: "name",
    message: "请输入项目名称"
  },
  {
    type: "list",
    name: "project",
    message: "请选择要创建的项目类型?",
    choices: ["Vue框架项目", "Web项目", "小程序"],
    filter: function(val) {
      return val.toLowerCase();
    }
  }
];

var vueProjectQuestions = [
  {
    type: "confirm",
    name: "includeVuex",
    message: "是否使用Vuex?",
    default: false
  }
];

var miniappQuestions = [
  {
    type: "list",
    name: "miniapp",
    message: "请选择使用小程序框架?",
    choices: ["Taro框架", "uni-app框架"],
    filter: function(val) {
      return val.toLowerCase();
    }
  }
];

var promptQuestions = function(questions, callback) {
  inquirer.prompt(questions).then(function(answers) {
    callback(answers);
  });
};

var initProject = function(name, gitUrl) {
  var child = shell.exec("pwd", { async: true, silent: true });
  child.stdout.on("data", function(data) {
    shell.cd(data);
  });

  shell.exec(`git clone ${gitUrl} ${name}`);
  shell.rm("-rf", `${name}/.git`);
  shell.cd(name);
  shell.exec("git init");
};

var finishMessage = function() {
  console.log("\n\n项目初始化完成!");
  console.log("\n请进入项目，安装依赖后开始!");
  console.log("\nHappy Coding!!!");
};

program
  .command("init")
  .description("init a sample project")
  .action(function(command) {
    promptQuestions([questions[0]], function(nameAnswer) {
      console.log("name:", nameAnswer);
      const { name } = nameAnswer;

      let gitUrl = "";

      if (name) {
        promptQuestions([questions[1]], function(projectAnswer) {
          const { project } = projectAnswer;

          switch (project) {
            case "vue框架项目":
              promptQuestions(vueProjectQuestions, function(vueProjectAnswers) {
                const { includeVuex } = vueProjectAnswers;
                if (includeVuex) {
                  gitUrl = repositories[1];
                } else {
                  gitUrl = repositories[0];
                }
                initProject(name, gitUrl);
                finishMessage();
              });
              break;
            case "web项目":
              gitUrl = repositories[2];
              initProject(name, gitUrl);
              finishMessage();
              break;
            case "小程序":
              promptQuestions(miniappQuestions, function(miniappAnswers) {
                const { miniapp } = miniappAnswers;
                console.log("miniapp:", miniapp);
                switch (miniapp) {
                  case "taro框架":
                    gitUrl = repositories[3];
                    break;
                  case "uni-app框架":
                    gitUrl = repositories[4];
                    break;
                  default:
                    break;
                }
                initProject(name, gitUrl);
                finishMessage();
              });
              break;
            case "空项目":
              break;
            default:
              break;
          }
        });
      } else {
        console.log("请输入项目名再继续!");
      }
    });
  });

program.parse(process.argv);

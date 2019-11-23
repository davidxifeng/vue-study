import {PaginationResponse} from "gitlab/dist/types/core/infrastructure";
import { Gitlab } from 'gitlab';
import * as Sequelize  from 'sequelize';
const fs = require("fs").promises;

const sequelize = new Sequelize.Sequelize({
    dialect: 'sqlite',
    storage: 'data.db',
    define: {
        timestamps: false
    }
});

class Journal extends Sequelize.Model {}

Journal.init({
    id: {type: Sequelize.INTEGER, primaryKey: true},
    title: {type: Sequelize.TEXT, allowNull: false,},
    content: {type: Sequelize.TEXT, allowNull: false,},
    created_at: {type: Sequelize.INTEGER, allowNull: false,},
    updated_at: {type: Sequelize.INTEGER, allowNull: false,},
    raw_json: {type: Sequelize.TEXT, allowNull: false,}
}, {
    sequelize, modelName: "t_journal"
});

interface Issue {
    id: number,
    iid: number,
    project_id: number,
    title: string,
    description: string,
    state: 'opened',
    created_at: string,
    updated_at: string, // '2019-11-23T02:19:23.641Z',
    labels: [string],
    user_notes_count: number,
}

class JournalContent extends Sequelize.Model {}
JournalContent.init({
    id: {type: Sequelize.INTEGER, primaryKey: true},
    body: {type: Sequelize.TEXT, allowNull: false},
    created_at: {type: Sequelize.INTEGER, allowNull: false,},
    updated_at: {type: Sequelize.INTEGER, allowNull: false,},
    journal_id: {type: Sequelize.INTEGER, allowNull: false},
    raw_json: {type: Sequelize.TEXT, allowNull: false,}
}, {
    sequelize, modelName: "t_journal_content"
});

interface Author {
    id: number,
    name: string,
    username: string,
    state: string,
    avatar_url: string,
    web_url: string
}

interface IssueNote {
    id: number,
    body: string,
    attachment: object,
    author: Author,
    created_at: string,
    updated_at: string,
    system: false,
    noteable_id: string,
    noteable_type: string,
    resolvable: boolean,
    noteable_iid: number
}

async function readConfig() {
    const fileContent = await fs.readFile("config.json");
    return JSON.parse(fileContent) as {token: string, projectId: number};
}


async function gitlab_test() {
  const cfg = await readConfig();
  const api = new Gitlab({ token: cfg.token,});

    async function save_issue(issueList: Issue[]) {
        for (const issue of issueList) {
            console.log(issue.id, issue.title);
            Journal.create({
                id: issue.id, title: issue.title, content: issue.description,
                created_at: issue.created_at, updated_at: issue.updated_at,
                raw_json: JSON.stringify(issue),
            });
            const notes = await api.IssueNotes.all(cfg.projectId, issue.iid) as IssueNote[];
            for (const note of notes) {
                JournalContent.create({
                    id: note.id, body: note.body, journal_id: note.noteable_id,
                    created_at: note.created_at, updated_at: note.updated_at,
                    raw_json: JSON.stringify(note),
                });
            }
        }
    }

  try {
      let currPage = 1;
      let totalPages = 0;
      do {
          let allIssues = await api.Issues.all({
              projectId: cfg.projectId,
              page: currPage, maxPages: 1, perPage: 20, showPagination: true,
          }) as PaginationResponse;
          totalPages = allIssues.pagination.totalPages;
          let issueList = allIssues.data as Issue[];
          await save_issue(issueList);
          currPage += 1;
      } while (currPage <= totalPages);
  } catch (e) {
    console.log(e);
  }
}

async function seq() {
    try {
        await sequelize.authenticate();
        sequelize.sync();
        return "ok";
    } catch (e) {
        console.error('unable to connect to db', e);
    }
}


function main() {
    seq().then( v => {console.log(v);});

    gitlab_test().then( v => {
        console.log('ok');
    }).catch( e => {
        console.error(e);
    });
}

main();

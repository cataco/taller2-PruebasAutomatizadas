'use strict'; // necessary for es6 output in node

import { browser, element, by, ElementFinder, ElementArrayFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

const expectedH1 = 'Tour of Heroes';
const expectedTitle = `${expectedH1}`;
const targetHero = { id: 15, name: 'Magneta' };
const targetHeroDashboardIndex = 3;
const nameSuffix = 'X';
const newHeroName = targetHero.name + nameSuffix;

class Hero {
  id: number;
  name: string;

  // Factory methods

  // Hero from string formatted as '<id> <name>'.
  static fromString(s: string): Hero {
    return {
      id: +s.substr(0, s.indexOf(' ')),
      name: s.substr(s.indexOf(' ') + 1),
    };
  }

  // Hero from hero list <li> element.
  static async fromLi(li: ElementFinder): Promise<Hero> {
      let stringsFromA = await li.all(by.css('a')).getText();
      let strings = stringsFromA[0].split(' ');
      return { id: +strings[0], name: strings[1] };
  }

  // Hero id and name from the given detail element.
  static async fromDetail(detail: ElementFinder): Promise<Hero> {
    // Get hero id from the first <div>
    let _id = await detail.all(by.css('div')).first().getText();
    // Get name from the h2
    let _name = await detail.element(by.css('h2')).getText();
    return {
        id: +_id.substr(_id.indexOf(' ') + 1),
        name: _name.substr(0, _name.lastIndexOf(' '))
    };
  }
}

describe('Proyecto base', () => {

  beforeAll(() => browser.get(''));

  function getPageElts() {
    let navElts = element.all(by.css('app-root nav a'));

    return {
      navElts: navElts,

      appDashboardHref: navElts.get(0),
      appDashboard: element(by.css('app-root app-dashboard')),
      topHeroes: element.all(by.css('app-root app-dashboard > div h4')),

      appHeroesHref: navElts.get(1),
      appHeroes: element(by.css('app-root app-heroes')),
      allHeroes: element.all(by.css('app-root app-heroes li')),
      selectedHeroSubview: element(by.css('app-root app-heroes > div:last-child')),

      heroDetail: element(by.css('app-root app-hero-detail > div')),

      searchBox: element(by.css('#search-box')),
      searchResults: element.all(by.css('.search-result li'))
    };
  }

  describe('Initial page', () => {

    it(`has title '${expectedTitle}'`, () => {
      expect(browser.getTitle()).toEqual(expectedTitle);
    });

    it(`has h1 '${expectedH1}'`, () => {
        expectHeading(1, expectedH1);
    });

    const expectedViewNames = ['Dashboard', 'Heroes'];
    it(`has views ${expectedViewNames}`, () => {
      let viewNames = getPageElts().navElts.map((el: ElementFinder) => el.getText());
      expect(viewNames).toEqual(expectedViewNames);
    });

    it('has dashboard as the active view', () => {
      let page = getPageElts();
      expect(page.appDashboard.isPresent()).toBeTruthy();
    });
    it('has heroes as the active view', () => {
      let page = getPageElts();
      expect(page.appDashboard.isPresent()).toBeTruthy();
      page.appHeroesHref.click();
      expect(page.appHeroes.isPresent()).toBeTruthy();
    });
    it('get hero from heroes list', () => {
      let page = getPageElts();
      page.appHeroesHref.click();
      var hero = page.allHeroes.get(targetHeroDashboardIndex);
      hero.click();
      expect(page.heroDetail.isPresent()).toBeTruthy();
    });
     it('get hero from dashboard search', () => {
      let page = getPageElts();
      page.appDashboardHref.click();
      page.searchBox.sendKeys(targetHero['name']);
      expect(page.searchResults.isPresent()).toBeTruthy();
      page.searchResults.first().click();
      expect(page.heroDetail.isPresent()).toBeTruthy();
    });
     it('get hero from top heroes list', () => {
      let page = getPageElts();
      page.appDashboardHref.click();
      var hero = page.topHeroes.get(targetHeroDashboardIndex);
      hero.click();
      expect(page.heroDetail.isPresent()).toBeTruthy();
    });
     it('update hero from top hero list', () => {
      let page = getPageElts();
      page.appHeroesHref.click();
      var hero = page.allHeroes.get(targetHeroDashboardIndex);
      hero.click();
      addToHeroName(newHeroName);
      element(by.xpath('/html/body/app-root/app-hero-detail/div/button[2]')).click();
      expect(page.appHeroes.isPresent()).toBeTruthy();
      var hero = page.allHeroes.get(targetHeroDashboardIndex);
      var HeroName = hero.element(by.css('a')).getText();
      expect(HeroName).toContain(newHeroName);
    });
     it('delete hero from top hero list', () => {
      let page = getPageElts();
      page.appHeroesHref.click();
      var hero = page.allHeroes.get(targetHeroDashboardIndex);
      var HeroName = hero.element(by.css('a')).getText();
      hero.element(by.css('button')).click();
      expect(page.appHeroes.isPresent()).toBeTruthy();
      var newHero = page.allHeroes.get(targetHeroDashboardIndex);
      var HeroNameNew = hero.element(by.css('a')).getText();
      expect(HeroName).not.toEqual(HeroNameNew);
    });




  });

});

function addToHeroName(text: string): promise.Promise<void> {
  let input = element(by.css('input'));
  return input.sendKeys(text);
}

function expectHeading(hLevel: number, expectedText: string): void {
    let hTag = `h${hLevel}`;
    let hText = element(by.css(hTag)).getText();
    expect(hText).toEqual(expectedText, hTag);
};

function getHeroAEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('..'));
}

function getHeroLiEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('../..'));
}

async function toHeroArray(allHeroes: ElementArrayFinder): Promise<Hero[]> {
  let promisedHeroes = await allHeroes.map(Hero.fromLi);
  // The cast is necessary to get around issuing with the signature of Promise.all()
  return <Promise<any>> Promise.all(promisedHeroes);
}

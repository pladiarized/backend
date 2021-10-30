/*
 *
 * HomePage
 *
 */
/* eslint-disable */
import React, { memo, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { get, upperFirst } from 'lodash';
import { auth, LoadingIndicatorPage } from 'strapi-helper-plugin';
import PageTitle from '../../components/PageTitle';
import { useModels } from '../../hooks';

import useFetch from './hooks';
import { ALink, Block, Container, LinkWrapper, P, Wave, Separator } from './components';
import BlogPost from './BlogPost';
import SocialLink from './SocialLink';

const FIRST_BLOCK_LINKS = [
  {
    link:
      'https://strapi.io/documentation/developer-docs/latest/getting-started/quick-start.html#_4-create-a-category-content-type',
    contentId: 'app.components.BlockLink.documentation.content',
    titleId: 'app.components.BlockLink.documentation',
  },
  {
    link: 'https://github.com/strapi/foodadvisor',
    contentId: 'app.components.BlockLink.code.content',
    titleId: 'app.components.BlockLink.code',
  },
];

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    link: 'https://github.com/strapi/strapi/',
  },
  {
    name: 'Discord',
    link: 'https://discord.strapi.io/',
  },
  {
    name: 'Reddit',
    link: 'https://www.reddit.com/r/Strapi/',
  },
  {
    name: 'Twitter',
    link: 'https://twitter.com/strapijs',
  },
  {
    name: 'Blog',
    link: 'https://strapi.io/blog',
  },
  {
    name: 'Forum',
    link: 'https://forum.strapi.io',
  },
  {
    name: 'Careers',
    link: 'https://strapi.io/careers',
  },
];

const HomePage = ({ history: { push } }) => {
  const { error, isLoading, posts } = useFetch();
  // Temporary until we develop the menu API
  const { collectionTypes, singleTypes, isLoading: isLoadingForModels } = useModels();

  const handleClick = e => {
    e.preventDefault();

    push(
      '/plugins/content-type-builder/content-types/plugins::users-permissions.user?modalType=contentType&kind=collectionType&actionType=create&settingType=base&forTarget=contentType&headerId=content-type-builder.modalForm.contentType.header-create&header_icon_isCustom_1=false&header_icon_name_1=contentType&header_label_1=null'
    );
  };

  const hasAlreadyCreatedContentTypes = useMemo(() => {
    const filterContentTypes = contentTypes => contentTypes.filter(c => c.isDisplayed);

    return (
      filterContentTypes(collectionTypes).length > 1 || filterContentTypes(singleTypes).length > 0
    );
  }, [collectionTypes, singleTypes]);

  if (isLoadingForModels) {
    return <LoadingIndicatorPage />;
  }

  const headerId = hasAlreadyCreatedContentTypes
    ? 'HomePage.greetings'
    : 'app.components.HomePage.welcome';
  const username = get(auth.getUserInfo(), 'firstname', '');


  return (
    <>
      <FormattedMessage id="HomePage.helmet.title">
        {title => <PageTitle title="TheBaton Admin" />}
      </FormattedMessage>
      <Container className="container-fluid">
        <div className="row">
          <div className="col-lg-8 col-md-12">
            <Block>
              <Wave />
              <FormattedMessage
                id={headerId}
                values={{
                  name: upperFirst(username),
                }}
              >
                {msg => <h2 id="mainHeader">{msg}</h2>}
              </FormattedMessage>
              <Separator style={{ marginTop: 37, marginBottom: 36 }} />
              <div className="text-thebaton">
                    <p>Once freed from the bonds of a mortal body, time is no longer significant. When I was mortal, I got frustrated at the fact it could take me decades of training to rise to the top. That’s why I cheated my way there.</p>
                    <p>“You have six months left to live,” the doctor had said. Nothing like a fatal ticking timer to motivate a girl into action. C’mon, I couldn’t leave my family behind to starve. I needed to know they were cared for, so yes, I broke a few human laws but you know what? I left them with with funds to carry them through, so no, I don’t regret it.</p>
                    <p>“For your thinth,” the creature hissed. “You will feel pain like you’ve never felt bef- bef-“ it broke into a spluttering laughter before it could even finish its sentence.</p>
                    <p>I shrugged. “I mean, I’m already dead. It’s not like I can get deader.”</p>
                    <p>The creature’s purple mouth turned into a snarl. “Oh, nononono, yeth.”</p>
                    <p>“Yes? I can get d-“</p>
                    <p>“No!” It snapped. “The big both has granted you an immortal body, but my both ith going to make you thuffer!”</p>
                    <p>It shoved a rusted sword towards me, then a shield. I took them both and grinned. “For me?!”</p>
                    <p>“You might need it,” it sniggered, almost bursting with excitement. When he withdrew I found myself on a grassy field, hills in the distant shrouded in mist.</p>
                    <p>I heard the hoard long before their silhouettes darkened the horizon. Hundreds upon hundreds of animalistic demons ran towards me. I spun, only to find myself circled. They crashed into me moments later.</p>
                    <p>That was my first fight. I lasted thirty seconds.</p>
                    <p>I awoke the next day to find my body healed.</p>
                    <p>The spluttering demon stood over me, grinning.</p>
                    <p>“That’s it?” I asked.</p>
                    <p>The creature’s grin widened. “Yeth. Everyday. Forever.” It threw my weapons towards me and walked away, cackling. And even before its laughter faded, I was on the field again. This time I jumped up and got ready.</p>
                    <p>I lasted a whole minute. And as I laid there on my back, the world fading to black, something clicked inside my head, and a wide smile crept over my face.</p>
                    <p>“What’th tho funny?!” My demon demanded.</p>
                    <p>I pushed myself up and snatched my sword and shield from him. “Tell your boss I’m coming for him.” I winked.</p>
                    <p>Forever is a long time. After just one battle, I had doubled my survival time. Without the consequence of death, and the determination of a human with literally nothing to lose, I decided I was going to learn to kick some ass, and then some.</p>
                    <p>—- Eight Thousand Years Later</p>
                    <p>“What do you mean, ‘she’th won’ ?”</p>
                    <p>The Devil glared at the lesser demon, Jorulok he was named. Jorulok the joke.</p>
                    <p>Jorulok wrung his hands together. “I mean she hath defeated the hordeth, my lord, and she thaid…”</p>
                    <p>“Well?!” Devil snapped, his patience quickly evaporating as puffs of smoke through his nostrils.</p>
                    <p>“She thaid-“</p>
                    <p>The door slammed open, crashing against the stone wall and splintering into pieces and startling the Devil himself.</p>
                    <p>“I said,” the human announced, “I’m coming for you."</p>
                </div>
            </Block>
          </div>
        </div>
      </Container>
    </>
  );
};

export default memo(HomePage);
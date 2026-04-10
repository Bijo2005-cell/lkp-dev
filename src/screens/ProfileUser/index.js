import React, { useState } from "react";
import cn from "classnames";
import styles from "./ProfileUser.module.sass";
import Icon from "../../components/Icon";
import Profile from "../../components/Profile";
import Reviews from "../../components/Reviews";
import Modal from "../../components/Modal";
import Background from "./Background";
import Details from "./Details";

const parametersUser = [
  {
    title: "Indentity verified",
    icon: "tick",
  },
  {
    title: "256 reviews",
    icon: "star-outline",
  },
];

const socials = [
  {
    title: "twitter",
    url: "https://twitter.com/ui8",
  },
  {
    title: "instagram",
    url: "https://www.instagram.com/ui8net/",
  },
  {
    title: "facebook",
    url: "https://www.facebook.com/ui8.net/",
  },
];

const avatars = [
  "/images/content/avatar-variant-1.jpg",
  "/images/content/avatar-variant-2.jpg",
  "/images/content/avatar-variant-3.jpg",
  "/images/content/avatar-variant-4.jpg",
  "/images/content/avatar-variant-5.jpg",
];

const ProfileUser = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <div className={styles.section}>
        <Background className={styles.background} />
        <div className={styles.body}>
          <div className={cn("container", styles.container)}>
            <Profile
              className={styles.profile}
              parametersUser={parametersUser}
              socials={socials}
              buttonText="Message"
            >
              <div className={cn(styles.avatar, styles.big)}>
                <img src="/images/content/avatar-girl.jpg" alt="Avatar" />
              </div>
              <button
                className={styles.update}
                onClick={() => setVisible(true)}
              >
                <Icon name="pencil" size="20" />
                Update avatar
              </button>
              <div className={cn("h4", styles.man)}>Kohaku Tora</div>
            </Profile>
            <div className={styles.wrapper}>
              <Details className={styles.details} />
              <Reviews className={styles.reviews} />
            </div>
          </div>
        </div>
      </div>
      <Modal
        visible={visible}
        onClose={() => setVisible(false)}
        outerClassName={styles.outer}
      >
        <div className={styles.file}>
          <input className={styles.load} type="file" />
          <div className={styles.icon}>
            <Icon name="upload-file" size="48" />
          </div>
          <div className={styles.format}>Drag and drop your photo here</div>
          <div className={styles.note}>or click to browse</div>
        </div>
        <div className={styles.gallery}>
          <div className={styles.info}>Use Fleet’s default photos</div>
          <div className={styles.list}>
            {avatars.map((x, index) => (
              <div className={styles.avatar} key={index}>
                <img src={x} alt="Avatar" />
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProfileUser;

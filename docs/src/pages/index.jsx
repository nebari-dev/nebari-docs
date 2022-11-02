import React from "react";
import Layout from "@theme/Layout";
import NebariLogoSvg from "../../static/logo/Nebari-logo-square.svg";
import RightArrowSvg from "../../static/icons/right-arrow-light.svg";
import LeavesCircleSvg from "../../static/img/home/leaves-circle.svg";
import JarPlantSvg from "../../static/img/home/jar-plant.svg";
import RootsPlantSvg from "../../static/img/home/roots-plant.svg";
import TwoPlantsSvg from "../../static/img/home/two-plants.svg";
import ThreeFramesSvg from "../../static/img/home/three-frames.svg";
import ScissorStringSvg from "../../static/img/home/scissor-string.svg";
import AwsSvg from "../../static/img/home/aws.svg";
import AzureSvg from "../../static/img/home/azure.svg";
import GcloudSvg from "../../static/img/home/gcloud.svg";
import DigitalOceanSvg from "../../static/img/home/digital-ocean.svg";
import CondaStoreSvg from "../../static/img/home/conda-store.svg";
import VSCodeSvg from "../../static/img/home/vscode.svg";
import GrafanaSvg from "../../static/img/home/grafana.svg";
import ClearMLSvg  from "../../static/img/home/clear-ml.svg";
import PrefectSvg from "../../static/img/home/prefect.svg";
import JupyterSvg from "../../static/img/home/jupyter.svg";
import styles from "./homepage.module.css";

export default function HomePage() {
  return (
    <Layout
      title="Nebari Homepage"
      description="Your open source data science platform. Built for scale, designed for collaboration."
    >
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.sectionContent}>
            <NebariLogoSvg width="158px" />
            <p className={styles.tagline1}>
              Your open source data science platform.
            </p>
            <p className={styles.tagline2}>
              Built for scale, designed for collaboration.
            </p>
            <p>
              <a
                href="/docs/category/get-started"
                className={styles.getStartedLink}
              >
                Get Started&nbsp;&nbsp;
                <RightArrowSvg />
              </a>
            </p>
          </div>
        </section>

        <section className={styles.pitchSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionHeading}>Why choose Nebari?</h2>
            <ol className={styles.pitchList}>
              <li className={styles.pitchItem}>
                <LeavesCircleSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>GitOps approach</span>
                <p>
                  Integrated DevOps and security best practices for a robust
                  deployment and better infrastructure management.
                </p>
              </li>
              <li className={styles.pitchItem}>
                <JarPlantSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>Opinionated</span>
                <p>
                  Designed with integrations and configurations selected from
                  real-world experience, so that you can use it out-of-the-box
                  for a variety of data science workloads.
                </p>
              </li>
              <li className={styles.pitchItem}>
                <RootsPlantSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>
                  Rooted in open source
                </span>
                <p>
                  Developed with community in mind and under a BSD-3 license, we
                  strive to contribute back to the upstream OSS projects
                  wherever possible.
                </p>
              </li>
              <li className={styles.pitchItem}>
                <TwoPlantsSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>
                  Collaboration-first
                </span>
                <p>
                  Large teams can share work and iterate quickly with
                  reproducible environments. Administrators can manage team
                  resources effectively, all from the same platform.
                </p>
              </li>
              <li className={styles.pitchItem}>
                <ThreeFramesSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>Dask powered</span>
                <p>
                  Nebari ships with Dask so you can scale your work to terabytes
                  of data, leverage cloud instances with GPUs, and take
                  advantage of adaptive scaling for managing costs.
                </p>
              </li>
              <li className={styles.pitchItem}>
                <ScissorStringSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>
                  Your favorite tools
                </span>
                <p>
                  Built with open source infrastructure and tools to give you
                  complete flexibility over your deployment and fit your
                  team&apos;s specific needs.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className={styles.platformsSection}>
          <div className={[styles.sectionContent, styles.platformsSectionContent].join(" ")}>
            <div className={styles.platformsLeft}>
              <div className={styles.platformsTextColumn}>
                <h2
                  className={[
                    styles.sectionHeading,
                    styles.platformsHeading,
                  ].join(" ")}
                >
                  Deploy anywhere
                </h2>
                <p>
                  Try Nebari on your local machine or deploy it on your cloud of
                  choice. Nebari is designed to be flexible, extensible, and
                  vendor-agnostic.
                </p>
                <p>
                  Nebari can be seamlessly deployed to the major public cloud
                  providers, including AWS, Azure, GCP, and Digital Ocean or to
                  bare-metal HPC clusters.
                </p>
              </div>
            </div>
            <div className={styles.platformsRight}>
              <ul className={styles.platformsList}>
                <li className={styles.platformsItem}>
                  <AwsSvg />
                </li>
                <li className={styles.platformsItem}>
                  <AzureSvg />
                </li>
                <li className={styles.platformsItem}>
                  <GcloudSvg />
                </li>
                <li className={styles.platformsItem}>
                  <DigitalOceanSvg />
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.getStartedSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionHeading}>Get started with Nebari</h2>
            <p>
              <a
                href="/docs/category/get-started"
                className={styles.getStartedLink2}
              >
                Learn how to deploy a Nebari instance&nbsp;&nbsp;
                <RightArrowSvg />
              </a>
            </p>
            <div>
              <img src="/img/home/dashboard.png" alt="Nebari dashboard" />
            </div>
          </div>
        </section>

        <section className={styles.integrationsSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionHeading}>Integrations</h2>
            <p className={styles.integrationsSubheading}>
              Nebari comes with out-of-the-box integrations to multiple tools in
              the Data Science ecosystem.
            </p>
            <ul className={styles.integrationsList}>
              <li className={styles.integrationsItem}>
                <CondaStoreSvg aria-hidden="true" />
                conda-store
              </li>
              <li className={styles.integrationsItem}>
                <VSCodeSvg aria-hidden="true" />
                VSCode
              </li>
              <li className={styles.integrationsItem}>
                <GrafanaSvg aria-hidden="true" />
                Grafana
              </li>
              <li className={styles.integrationsItem}>
                <ClearMLSvg aria-hidden="true" />
                ClearML
              </li>
              <li className={styles.integrationsItem}>
                <PrefectSvg aria-hidden="true" />
                Prefect
              </li>
              <li className={styles.integrationsItem}>
                <JupyterSvg aria-hidden="true" />
                Jupyter
              </li>
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  );
}

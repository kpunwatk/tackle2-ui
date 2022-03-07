import * as React from "react";
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  List,
  ListItem,
  Text,
  TextContent,
  Title,
  TitleSizes,
} from "@patternfly/react-core";
import { UseFormGetValues } from "react-hook-form";

import { IFormValues } from "./analysis-wizard";
import { Application } from "@app/api/models";

interface IReview {
  applications: Application[];
  getValues: UseFormGetValues<IFormValues>;
}

export const Review: React.FunctionComponent<IReview> = ({
  applications,
  getValues,
}) => {
  const {
    mode,
    targets,
    scope,
    includedPackages,
    excludedPackages,
    customRules,
  } = getValues();
  return (
    <>
      <TextContent>
        <Title headingLevel="h5" size={TitleSizes["lg"]}>
          Review analysis details
        </Title>
        <Text component="p">
          Review the information below, then run the analysis.
        </Text>
      </TextContent>
      <DescriptionList isHorizontal>
        <DescriptionListGroup>
          <DescriptionListTerm>Applications</DescriptionListTerm>
          <DescriptionListDescription id="applications">
            <List isPlain>
              {applications.map((app) => (
                <ListItem key={app.id}>{app.name}</ListItem>
              ))}
            </List>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Mode</DescriptionListTerm>
          <DescriptionListDescription id="mode">
            {mode}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>
            {targets.length > 1 ? "Targets" : "Target"}
          </DescriptionListTerm>
          <DescriptionListDescription id="targets">
            <List isPlain>
              {targets.map((target) => (
                <ListItem key={target}>{target}</ListItem>
              ))}
            </List>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Scope</DescriptionListTerm>
          <DescriptionListDescription id="scope">
            {scope}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Included packages</DescriptionListTerm>
          <DescriptionListDescription id="packages">
            <List isPlain>
              {includedPackages.map((pkg) => (
                <ListItem key={pkg}>{pkg}</ListItem>
              ))}
            </List>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Custom rules</DescriptionListTerm>
          <DescriptionListDescription id="rules">
            <List isPlain>
              {customRules.map((rule) => (
                <ListItem key={rule}>{rule}</ListItem>
              ))}
            </List>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Advanced options</DescriptionListTerm>
          <DescriptionListDescription id="options">
            {"Todo"}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </>
  );
};
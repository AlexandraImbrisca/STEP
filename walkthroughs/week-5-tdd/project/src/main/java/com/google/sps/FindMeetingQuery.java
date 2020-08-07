// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.TreeMap;

/**
 * Class used to comparing the slots based on the number of optional attendees that can participate
 * in the given slot.
 */
final class SlotAttendance implements Comparable<SlotAttendance> {
  private TimeRange timeSlot;
  private int attendance;

  /**
   * Creates a new slot-attendance association.
   *
   * @param timeSlot The time slot considered.
   * @param attendance The number of optional attendees that can participate in the given slot.
   */
  public SlotAttendance(TimeRange timeSlot, int attendance) {
    this.timeSlot = timeSlot;
    this.attendance = attendance;
  }

  /** Returns the time slot. */
  public TimeRange getTimeSlot() {
    return timeSlot;
  }

  /** Returns the attendance. */
  public int getAttendance() {
    return attendance;
  }

  /** Compares two objects based on the biggest attendance. */
  @Override
  public int compareTo(SlotAttendance other) {
    return other.getAttendance() - this.getAttendance();
  }
}

public final class FindMeetingQuery {

  /**
   * Initialises a list of SlotAttendance associations for a given list of time slots and an
   * attendance of numberOfOptionalAttendees.
   *
   * @param slots The given list of time slots.
   * @param numberOfOptionalAttendees The initial attendance of each time slot.
   */
  public List<SlotAttendance> initSlotsAttendance(
      List<TimeRange> slots, int numberOfOptionalAttendees) {
    List<SlotAttendance> slotsAttendance = new ArrayList<SlotAttendance>();

    for (TimeRange slot : slots) {
      slotsAttendance.add(new SlotAttendance(slot, numberOfOptionalAttendees));
    }

    return slotsAttendance;
  }

  /**
   * Computes the number of the target attendees that also participate to the current event.
   *
   * @param currentEvent The event.
   * @param targetAttendees The attendees that will be searched through the attendee list of the
   *     currentEvent.
   * @return The truth value of the condition described.
   */
  private int getNumberOfCommonAttendees(Event currentEvent, Collection<String> targetAttendees) {
    // Create a new hashset from the event's set of attendees (since the
    // retainAll function will remove all the attendees that are not common,
    // we can't use a set of a fixed size).
    Set<String> eventAttendees = new HashSet<>(currentEvent.getAttendees());

    // Get the common attendees by performing the intersection of the two
    // collections.
    eventAttendees.retainAll(targetAttendees);
    return eventAttendees.size();
  }

  /**
   * Computes the "intersection" slot - just like the intersection of two sets, the intersection
   * slot is the common slot of two overlapsed slots.
   *
   * @param firstSlot The first slot.
   * @param secondSlot The second slot.
   * @return The intersection slot.
   */
  private Optional<TimeRange> getIntersectionSlot(TimeRange firstSlot, TimeRange secondSlot) {
    // Based on how the slots are scheduled we can have one of the following cases:
    //
    // Case 1: |---|                |---|      - firstSlot
    //           |---|     or     |---|        - secondSlot
    //    =>     |-|                |-|
    //
    // Case 2: |---------|          |---|    - firstSlot
    //            |---|    or    |---------| - secondSlot
    //    =>      |---|             |---|
    //
    // Case 3: |--|                   |--| - firstSlot
    //              |--|   or    |--|      - secondSlot
    //    =>

    if (!firstSlot.overlaps(secondSlot)) {
      return Optional.empty();
    }

    int slotStart = Math.max(firstSlot.start(), secondSlot.start());
    int slotEnd = Math.min(firstSlot.end(), secondSlot.end());

    return Optional.of(TimeRange.fromStartEnd(slotStart, slotEnd, false));
  }

  /**
   * Computes the "difference" slots - just like the difference of two sets, the difference slots
   * represent the slots resulted after eliminating the minorSlot from the mainSlot.
   *
   * @param mainSlot The main slot as described above.
   * @param minorSlot The minor slot as described above.
   * @param duration The duration of the target event for filtering the resulted slots (only slots
   *     with at least the same duration will be considered)
   * @return The filtered list of the resulted slots.
   */
  private List<TimeRange> getDifferenceSlots(
      TimeRange mainSlot, TimeRange minorSlot, long targetDuration) {
    // Based on how the slots are scheduled we can have one of the following cases:
    //
    // Case 1: |---|             |---|      - mainSlot
    //            |---|    or |---|         - minorSlot
    //    =>   |--|               |--|
    //
    // Case 2: |---------|       |---|    - mainSlot
    //            |---|    or |---------| - minorSlot
    //    =>   |--|   |--|
    //
    // Case 3: |--|                  |--| - mainSlot
    //              |--|   or   |--|      - minorSlot
    //    =>   |--|                  |--|

    if (!mainSlot.overlaps(minorSlot)) {
      return Arrays.asList(mainSlot);
    }

    List<TimeRange> resultingSlots = new ArrayList<TimeRange>();

    // Determine the common interval that should be removed.
    Optional<TimeRange> optionalIntersectionSlot = getIntersectionSlot(mainSlot, minorSlot);
    if (!optionalIntersectionSlot.isPresent()) {
      return Arrays.asList(mainSlot);
    }

    TimeRange intersectionSlot = optionalIntersectionSlot.get();

    int remainingLeftSlotStart = mainSlot.start();
    int remainingLeftSlotEnd = intersectionSlot.start();
    int remainingLeftSlotDuration = remainingLeftSlotEnd - remainingLeftSlotStart;

    if (remainingLeftSlotDuration >= targetDuration) {
      resultingSlots.add(
          TimeRange.fromStartEnd(remainingLeftSlotStart, remainingLeftSlotEnd, false));
    }

    int remainingRightSlotStart = intersectionSlot.end();
    int remainingRightSlotEnd = mainSlot.end();
    int remainingRightSlotDuration = remainingRightSlotEnd - remainingRightSlotStart;

    if (remainingRightSlotDuration >= targetDuration) {
      resultingSlots.add(
          TimeRange.fromStartEnd(remainingRightSlotStart, remainingRightSlotEnd, false));
    }

    return resultingSlots;
  }

  /**
   * Computes the available slots after considering all the other events to which the mandatory
   * attendees participate.
   *
   * @param currentEvents The events already scheduled.
   * @param mandatoryAttendees The mandatory attendees of the desired event.
   * @param targetDuration The duration of the desired event.
   * @return The slots available for scheduling the meeting.
   */
  public List<TimeRange> getSlotsAvailable(
      Collection<Event> currentEvents, Collection<String> mandatoryAttendees, long targetDuration) {
    // The hashmap will store pairs such as (startTime, endTime), where endTime
    // is the latest end of all the events that start at the same startTime.
    HashMap<Integer, Integer> unavailableSlots = new HashMap<Integer, Integer>();

    for (Event currentEvent : currentEvents) {
      if (!Collections.disjoint(currentEvent.getAttendees(), mandatoryAttendees)) {
        TimeRange currentEventSlot = currentEvent.getWhen();
        int currentEventStart = currentEventSlot.start();
        int currentEventEnd = currentEventSlot.end();

        if (unavailableSlots.containsKey(currentEventStart)) {
          unavailableSlots.put(
              currentEventStart,
              Math.max(unavailableSlots.get(currentEventStart), currentEventEnd));
        } else {
          unavailableSlots.put(currentEventStart, currentEventEnd);
        }
      }
    }

    TreeMap<Integer, Integer> sortedUnavailableSlots =
        new TreeMap<Integer, Integer>(unavailableSlots);
    List<TimeRange> availableSlots = new ArrayList<TimeRange>();

    int currentSlotStart = TimeRange.START_OF_DAY;
    int currentSlotEnd;

    for (Map.Entry<Integer, Integer> unavailableSlot : sortedUnavailableSlots.entrySet()) {
      int unavailableSlotStart = unavailableSlot.getKey();
      int unavailableSlotEnd = unavailableSlot.getValue();

      // Pass over the unavailable slots that started earlier but might not
      // be over yet.
      if (unavailableSlotStart < currentSlotStart) {
        currentSlotStart = Math.max(currentSlotStart, unavailableSlotEnd);
        continue;
      }
      currentSlotEnd = unavailableSlotStart;
      if (currentSlotEnd - currentSlotStart >= targetDuration) {
        availableSlots.add(TimeRange.fromStartEnd(currentSlotStart, currentSlotEnd, false));
      }
      currentSlotStart = unavailableSlotEnd;
    }

    if (TimeRange.END_OF_DAY - currentSlotStart >= targetDuration) {
      availableSlots.add(TimeRange.fromStartEnd(currentSlotStart, TimeRange.END_OF_DAY, true));
    }

    return availableSlots;
  }

  /**
   * Selects the slots with the biggest attendance.
   *
   * @param slotsAttendance The associations between the time slots and the attendances.
   * @return A list consisting of the time slots with the biggest attendance.
   */
  public List<TimeRange> getTheBestAttendanceSlots(List<SlotAttendance> slotsAttendance) {
    Collections.sort(slotsAttendance);

    List<TimeRange> chosenSlots = new ArrayList<TimeRange>();
    int maxAttendance = slotsAttendance.get(0).getAttendance();

    for (SlotAttendance slotAttendance : slotsAttendance) {
      int currentSlotAttendance = slotAttendance.getAttendance();
      if (currentSlotAttendance < maxAttendance) {
        break;
      }
      chosenSlots.add(slotAttendance.getTimeSlot());
    }

    return chosenSlots;
  }

  /**
   * Filters the available slots by adding the most optional attendees that can participate.
   *
   * @param currentEvents The events already scheduled.
   * @param optionalAttendees The optional attendees of the desired event.
   * @param availableSlots The available slots that will be filtered.
   * @param targetDuration The duration of the desired event.
   * @return The slots that include as many optional attendees as possible.
   */
  public List<TimeRange> includeOptionalAttendees(
      Collection<Event> currentEvents,
      Collection<String> optionalAttendees,
      List<TimeRange> availableSlots,
      long targetDuration) {
    if (optionalAttendees.size() == 0 || availableSlots.size() == 0) {
      return availableSlots;
    }

    // Assume that each time slot can be attended by all the optional
    // participants.
    List<SlotAttendance> slotsAttendance =
        initSlotsAttendance(availableSlots, optionalAttendees.size());

    for (Event currentEvent : currentEvents) {
      int commonAttendees = getNumberOfCommonAttendees(currentEvent, optionalAttendees);
      if (commonAttendees > 0) {
        List<SlotAttendance> newSlotsAttendance = new ArrayList<SlotAttendance>();
        TimeRange currentEventSlot = currentEvent.getWhen();

        Iterator iterator = slotsAttendance.iterator();
        while (iterator.hasNext()) {
          SlotAttendance slotAttendance = (SlotAttendance) iterator.next();
          TimeRange currentSlot = slotAttendance.getTimeSlot();
          int currentAttendance = slotAttendance.getAttendance();

          if (currentSlot.overlaps(currentEventSlot)) {
            iterator.remove();

            Optional<TimeRange> optionalIntersectionSlot =
                getIntersectionSlot(currentSlot, currentEventSlot);
            if (!optionalIntersectionSlot.isPresent()) {
              break;
            }

            TimeRange intersectionSlot = optionalIntersectionSlot.get();

            // If the intersection slot is long enough to hold the meeting,
            // update the slot by ignoring the optional attendees that are
            // no longer available.
            if (intersectionSlot.duration() >= targetDuration) {
              newSlotsAttendance.add(
                  new SlotAttendance(intersectionSlot, currentAttendance - commonAttendees));
            }

            List<TimeRange> differenceSlots =
                getDifferenceSlots(currentSlot, currentEventSlot, targetDuration);

            for (TimeRange slot : differenceSlots) {
              newSlotsAttendance.add(new SlotAttendance(slot, currentAttendance));
            }
          }
        }
        slotsAttendance.addAll(newSlotsAttendance);
      }
    }
    return getTheBestAttendanceSlots(slotsAttendance);
  }

  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    Collection<String> mandatoryAttendees = request.getAttendees();
    Collection<String> optionalAttendees = request.getOptionalAttendees();
    long duration = request.getDuration();

    if (duration > TimeRange.WHOLE_DAY.duration()) {
      return Arrays.asList();
    }

    List<TimeRange> slotsAvailable = getSlotsAvailable(events, mandatoryAttendees, duration);
    slotsAvailable = includeOptionalAttendees(events, optionalAttendees, slotsAvailable, duration);

    return slotsAvailable;
  }
}
